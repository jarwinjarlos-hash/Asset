// --- Global State Variables (Shared across modules) ---
let assetData = []; // Array of asset/transaction objects
let historicalPrices = {}; // Cache for asset historical data
let exchangeRates = {}; // Cache for currency exchange rates
let currentBaseCurrency = 'USD'; 
let isPrivacyMode = false; // Controls UI visibility of sensitive data

// --- DOM Elements (Centralized access for all modules) ---
// This prevents every function from needing to re-fetch elements.
const DOM = {
    totalValueEl: document.getElementById('total-asset-value'),
    totalGainLossEl: document.getElementById('total-gain-loss'),
    offlineBanner: document.getElementById('offline-banner'),
    offlineBannerMessage: document.getElementById('offline-banner-message'),
    rateStatusEl: document.getElementById('rate-status'),
    // Add any other globally referenced DOM elements here (e.g., table bodies, chart containers)
    // Example: transactionTableBody: document.getElementById('transaction-table-body'),
};

// --- Core Data Functions (Content transferred from old inline script) ---

/**
 * Utility function to format currency consistently (placeholder for your original function).
 */
function formatCurrency(value, currency) {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(value);
}


/**
 * Loads user settings and asset data from Firestore.
 * This is called by firebase-init.js when the user authenticates.
 */
function loadUserData() {
    console.log('Attempting to load user data...');
    
    // Check if we have a valid reference to the user's Firestore document
    if (userDocRef) {
        // Your existing logic for fetching data using userDocRef.get() or onSnapshot()
        // Example structure for data fetching:
        userDocRef.get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                // 1. Load asset data
                assetData = data.assets || [];
                
                // 2. Load settings (e.g., base currency, privacy mode state)
                currentBaseCurrency = data.settings?.baseCurrency || 'USD';
                isPrivacyMode = data.settings?.isPrivacyMode || false;

                console.log('Data loaded successfully. Assets:', assetData.length);
            } else {
                console.log('No user document found. Initializing new profile.');
                assetData = [];
            }
            // Trigger the rendering and rate updates regardless of whether data was found
            if (typeof renderAll === 'function') {
                renderAll();
                updateRatesStatus(); 
            }
        }).catch(error => {
            console.error('Error loading user data:', error);
        });
    } else {
        // Fallback for non-authenticated/anonymous users, often defaults to empty data
        assetData = [];
        if (typeof renderAll === 'function') {
            renderAll();
        }
    }
}

/**
 * Saves the current state (asset data and settings) back to Firestore.
 * This should be called after every successful transaction or setting change.
 */
function saveAssetData() {
    if (userDocRef && currentUser) {
        const dataToSave = {
            assets: assetData,
            settings: {
                baseCurrency: currentBaseCurrency,
                isPrivacyMode: isPrivacyMode,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }
        };
        
        userDocRef.set(dataToSave, { merge: true })
            .then(() => {
                console.log('Asset data and settings saved successfully.');
            })
            .catch(error => {
                console.error('Error saving data:', error);
            });
    } else {
        console.warn('Cannot save data: User not authenticated or userDocRef missing.');
    }
}

/**
 * Fetches the latest currency exchange rates from an external API (placeholder).
 * NOTE: Replace with your actual API endpoint and logic.
 */
function updateExchangeRates() {
    console.log('Fetching exchange rates...');
    // This is a placeholder for your actual API call logic
    
    // Simulating an API call success
    setTimeout(() => {
        exchangeRates = {
            'EUR': 0.92,
            'GBP': 0.81,
            'JPY': 156.45,
            // ... your fetched rates ...
        };
        console.log('Exchange rates updated.');
        // Trigger a re-render
        if (typeof renderAll === 'function') {
            renderAll();
        }
    }, 500);
}

/**
 * Calculates all summary metrics (Total Value, Gain/Loss, Dividends, etc.).
 * Returns the results as an object.
 */
function calculateSummaryMetrics() {
    console.log('Calculating summary metrics...');
    // Your existing complex calculation logic goes here, using assetData and exchangeRates
    
    let totalValue = 0;
    let totalCost = 0;
    
    // --- Sample Calculation Logic (Replace with your own) ---
    // assetData.forEach(asset => {
    //     const rate = exchangeRates[asset.currency] || 1;
    //     // Logic to convert asset value to currentBaseCurrency
    //     totalValue += asset.currentValue * rate; 
    //     totalCost += asset.totalCost * rate;
    // });
    
    // Placeholder results
    const metrics = {
        totalValue: 123456.78,
        totalGainLoss: 12345.67,
        monthlyDividend: 123.45
    };
    
    return metrics;
}

/**
 * Populates currency datalists in the transaction forms (e.g., <datalist id="currency-list">).
 */
function populateCurrencyDatalists() {
    console.log('Populating currency datalists.');
    const currencyList = document.getElementById('currency-list');
    if (!currencyList) return;
    
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'BTC', 'ETH']; // Example list
    currencyList.innerHTML = currencies.map(c => `<option value="${c}">`).join('');
}

// All core variables (assetData, exchangeRates, etc.) and core functions 
// (loadUserData, saveAssetData, calculateSummaryMetrics) are now defined here.
