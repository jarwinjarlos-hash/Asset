// This file manages all Chart.js instances for visualization.

// --- Chart Instances ---
let allocationChart = null;
let portfolioTrendChart = null;
let gainLossChart = null;
let dividendChart = null;

/**
 * Initializes all Chart.js instances on the Dashboard.
 * This function should be called once during the application's startup (DOMContentLoaded).
 */
function initializeCharts() {
    console.log('Initializing Chart.js instances...');
    
    // NOTE: You must ensure your HTML contains elements with the IDs below, e.g., <canvas id="allocation-chart"></canvas>
    
    // 1. Allocation Chart (Doughnut/Pie)
    const allocationCtx = document.getElementById('allocation-chart')?.getContext('2d');
    if (allocationCtx) {
        allocationChart = new Chart(allocationCtx, { 
            type: 'doughnut', 
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            } 
        });
    }

    // 2. Portfolio Trend Chart (Line)
    const trendCtx = document.getElementById('trend-chart')?.getContext('2d');
    if (trendCtx) {
        portfolioTrendChart = new Chart(trendCtx, { 
            type: 'line', 
            data: { labels: [], datasets: [{ label: 'Portfolio Value', data: [], borderColor: '#3b82f6', tension: 0.1 }] }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: false } }
            } 
        });
    }

    // 3. Gain/Loss Distribution Chart (Bar)
    const gainLossCtx = document.getElementById('gain-loss-chart')?.getContext('2d');
    if (gainLossCtx) {
        gainLossChart = new Chart(gainLossCtx, { 
            type: 'bar', 
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            } 
        });
    }

    // 4. Dividend Income Chart (Bar/Line combo)
    const dividendCtx = document.getElementById('dividend-chart')?.getContext('2d');
    if (dividendCtx) {
        dividendChart = new Chart(dividendCtx, { 
            type: 'bar', 
            data: { labels: [], datasets: [{ label: 'Monthly Dividend', data: [], backgroundColor: '#10b981' }] }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { x: { stacked: true }, y: { stacked: true } }
            } 
        });
    }
}

/**
 * Calculates the necessary data structures for all charts based on the global assetData.
 * @returns {Object} An object containing structured data for each chart.
 */
function prepareChartData() {
    // This is where you process global state (assetData, historicalPrices) 
    // from js/app-core.js into chart-friendly arrays.

    // --- Placeholder Logic (Replace with your actual data processing) ---
    
    // Example 1: Allocation Data
    const assetTypes = ['Stocks', 'Crypto', 'Bonds', 'Cash'];
    const assetValues = [75000, 30000, 10000, 8000];
    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444']; 

    // Example 2: Trend Data (Last 6 Months)
    const trendLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const trendValues = [105000, 110500, 112000, 115000, 114500, 123456.78]; // Final value matches calculateSummaryMetrics()

    return {
        allocation: { labels: assetTypes, values: assetValues, colors: colors },
        trend: { labels: trendLabels, values: trendValues },
        gainLoss: { 
            labels: ['AAPL', 'TSLA', 'BTC', 'ETH'], // Top assets
            values: [5000, -1500, 2000, 800], // Gain/Loss
            colors: ['#10b981', '#ef4444', '#10b981', '#10b981']
        },
        dividend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [100, 120, 95, 130, 110, 123.45] // Monthly dividend income
        }
    };
}


/**
 * Updates all existing charts with the latest processed data.
 * This is called by the main renderAll() function in app-ui.js.
 */
function updateCharts() {
    const data = prepareChartData(); 
    
    if (allocationChart) {
        allocationChart.data.datasets[0].data = data.allocation.values;
        allocationChart.data.datasets[0].backgroundColor = data.allocation.colors;
        allocationChart.data.labels = data.allocation.labels;
        allocationChart.update();
    }
    
    if (portfolioTrendChart) {
        portfolioTrendChart.data.labels = data.trend.labels;
        portfolioTrendChart.data.datasets[0].data = data.trend.values;
        portfolioTrendChart.update();
    }
    
    if (gainLossChart) {
        gainLossChart.data.labels = data.gainLoss.labels;
        gainLossChart.data.datasets[0].data = data.gainLoss.values;
        gainLossChart.data.datasets[0].backgroundColor = data.gainLoss.colors;
        gainLossChart.update();
    }
    
    if (dividendChart) {
        dividendChart.data.labels = data.dividend.labels;
        dividendChart.data.datasets[0].data = data.dividend.values;
        dividendChart.update();
    }
}
