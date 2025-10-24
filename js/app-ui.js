// --- UI Utility Functions ---

/**
 * Toggles the visibility of sensitive financial data (blur effect).
 */
function updatePrivacyView() {
    const privacyToggleBtn = document.getElementById('privacy-toggle-btn');
    if (!privacyToggleBtn) return;
    
    // Check global state variable from app-core.js
    const isPrivate = isPrivacyMode; 

    // Find all elements that should be blurred (e.g., specific data display blocks)
    const sensitiveElements = document.querySelectorAll('[data-sensitive-value]');
    
    sensitiveElements.forEach(el => {
        if (isPrivate) {
            el.classList.add('blur-sm');
            el.textContent = '****'; // Replace content when blurred
        } else {
            el.classList.remove('blur-sm');
            // We rely on renderAll() to put the actual data back
        }
    });

    // Update the icon and tooltip for the toggle button
    const privacyOnIcon = document.getElementById('privacy-on-icon');
    const privacyOffIcon = document.getElementById('privacy-off-icon');

    if (privacyOnIcon && privacyOffIcon) {
        if (isPrivate) {
            privacyOnIcon.classList.remove('hidden');
            privacyOffIcon.classList.add('hidden');
            privacyToggleBtn.title = 'Click to show sensitive data';
        } else {
            privacyOnIcon.classList.add('hidden');
            privacyOffIcon.classList.remove('hidden');
            privacyToggleBtn.title = 'Click to hide sensitive data';
        }
    }
}

/**
 * Updates the status message for the exchange rates (e.g., Last Updated: 10 min ago).
 * Assumes a global variable like lastRateUpdateTimestamp exists in app-core.js or global scope.
 */
function updateRatesStatus() {
    // DOM.rateStatusEl is defined in app-core.js
    if (DOM.rateStatusEl) {
        // Placeholder implementation
        DOM.rateStatusEl.textContent = `Rates refreshed: ${new Date().toLocaleTimeString()}`;
    }
}

/**
 * Handles the display of the offline banner based on network status.
 * DOM elements (offlineBanner, offlineBannerMessage) are defined in app-core.js
 */
function handleOnlineStatus() {
    if (navigator.onLine) {
        DOM.offlineBanner?.classList.remove('show', 'opacity-100');
        DOM.offlineBanner?.classList.add('opacity-0', 'hidden');
    } else {
        DOM.offlineBanner?.classList.remove('opacity-0', 'hidden');
        DOM.offlineBanner?.classList.add('show', 'opacity-100');
        DOM.offlineBannerMessage.textContent = "You are offline. Changes are saved locally but won't sync until you reconnect.";
    }
    updateRatesStatus();
}


/**
 * Populates the asset tracker table with data from the global assetData array.
 */
function renderAssetTable() {
    // NOTE: You need to define a DOM element for the table body in js/app-core.js:
    // DOM.assetTableBody = document.getElementById('asset-table-body');
    
    // Placeholder function until you define the element in DOM
    console.log('Rendering asset table...');
    // if (!DOM.assetTableBody) return; 

    // Your existing logic for clearing the table body and iterating over assetData 
    // to create and append table rows (<tr>) goes here.
    
    // Example:
    // DOM.assetTableBody.innerHTML = assetData.map(asset => `<tr>...</tr>`).join('');
}


/**
 * The main rendering function called after any data change.
 * It ties together core logic, metrics, charts, and the UI.
 */
function renderAll() {
    console.log('--- Rendering All UI Components ---');
    
    // 1. Calculate metrics (function from app-core.js)
    const metrics = calculateSummaryMetrics(); 

    // 2. Update Dashboard Summary UI (using DOM from app-core.js)
    if (DOM.totalValueEl) {
        // We use formatCurrency and currentBaseCurrency from app-core.js
        const formattedValue = formatCurrency(metrics.totalValue, currentBaseCurrency);
        // data-sensitive-value ensures updatePrivacyView can find it and apply blur
        DOM.totalValueEl.textContent = formattedValue; 
        DOM.totalValueEl.setAttribute('data-sensitive-value', formattedValue); // Store real value for reference
    }
    if (DOM.totalGainLossEl) {
        const formattedGainLoss = formatCurrency(metrics.totalGainLoss, currentBaseCurrency);
        DOM.totalGainLossEl.textContent = formattedGainLoss;
        DOM.totalGainLossEl.setAttribute('data-sensitive-value', formattedGainLoss);
        // Also update class for color (green/red) based on metrics.totalGainLoss
        DOM.totalGainLossEl.classList.remove('text-green-500', 'text-red-500');
        DOM.totalGainLossEl.classList.add(metrics.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500');
    }
    
    // 3. Apply privacy mode (must run AFTER setting the actual content)
    updatePrivacyView();
    
    // 4. Update Charts (function from app-charts.js)
    if (typeof updateCharts === 'function') {
        updateCharts(); 
    }
    
    // 5. Update Asset Tracker Table
    renderAssetTable(); 
}

// --- Main App Initialization (DOMContentLoaded) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Charts (from app-charts.js)
    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }

    // 2. Load Privacy Mode State (from local storage)
    const storedPrivacyMode = localStorage.getItem('assetTrackerPrivacyMode');
    if (storedPrivacyMode !== null) {
        // isPrivacyMode is a global variable from app-core.js
        isPrivacyMode = JSON.parse(storedPrivacyMode); 
    }
    updatePrivacyView();

    // 3. Initial Data & Rates Setup (Functions from app-core.js)
    if (typeof populateCurrencyDatalists === 'function') {
        populateCurrencyDatalists();
    }
    if (typeof updateExchangeRates === 'function') {
        updateExchangeRates();
    }
    // Set up hourly rate refresh (from app-core.js)
    setInterval(updateExchangeRates, 3600000); 

    // --- Setup Event Listeners ---
    
    // 1. Tab Navigation Listener 
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.tabTarget;
            
            // Deactivate all
            tabButtons.forEach(btn => btn.classList.remove('bg-primary-600', 'text-white'));
            tabContents.forEach(content => content.classList.add('hidden'));

            // Activate current
            button.classList.add('bg-primary-600', 'text-white');
            document.querySelector(target)?.classList.remove('hidden');
        });
    });
    // Ensure the first tab is active on load
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }

    // 2. Privacy Toggle Listener 
    const privacyToggleBtn = document.getElementById('privacy-toggle-btn');
    privacyToggleBtn?.addEventListener('click', () => {
        // Toggle the global state and save it
        isPrivacyMode = !isPrivacyMode; 
        localStorage.setItem('assetTrackerPrivacyMode', isPrivacyMode);
        
        // Re-render the UI to apply the changes
        renderAll();
    });

    // 3. Online/Offline Handling 
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    handleOnlineStatus(); // Initial check

    // 4. Service Worker Registration 
    if ('serviceWorker' in navigator) { 
        window.addEventListener('load', () => { 
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => { console.log('SW registration successful'); })
                .catch(err => { console.log('SW registration failed: ', err); }); 
        }); 
    }
});
