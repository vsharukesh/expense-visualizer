/**
 * Charts - Handles all chart-related functionality using Chart.js
 */

export class Charts {
  constructor(expenseTracker) {
    this.expenseTracker = expenseTracker;
    this.charts = {};
    this.colorPalette = [
      '#4f46e5', // Indigo
      '#8b5cf6', // Violet
      '#ec4899', // Pink
      '#f59e0b', // Amber
      '#10b981', // Emerald
      '#3b82f6', // Blue
      '#f97316', // Orange
      '#6b7280'  // Gray
    ];
  }

  /**
   * Initialize all charts
   */
  init() {
    this.initMonthlySpendingChart();
    this.initCategorySpendingChart();
    
    // Update charts when the window is resized (with debounce)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.handleResize(), 250);
    });
  }

  /**
   * Initialize the monthly spending chart
   */
  initMonthlySpendingChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    const monthlyData = this.expenseTracker.getMonthlySpendingData();
    
    // Destroy existing chart if it exists
    if (this.charts.monthly) {
      this.charts.monthly.destroy();
    }

    this.charts.monthly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthlyData.map(item => item.month),
        datasets: [{
          label: 'Monthly Spending',
          data: monthlyData.map(item => item.total),
          backgroundColor: this.colorPalette[0] + '40',
          borderColor: this.colorPalette[0],
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 14, weight: '600' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const currency = localStorage.getItem('currency') || 'USD';
                const currencySymbols = {
                  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'AUD': 'A$', 'CAD': 'C$', 'CHF': 'CHF', 
                  'CNY': '¥', 'HKD': 'HK$', 'NZD': 'NZ$', 'SEK': 'kr', 'KRW': '₩', 'SGD': 'S$', 'NOK': 'kr',
                  'MXN': 'Mex$', 'INR': '₹', 'RUB': '₽', 'ZAR': 'R', 'BRL': 'R$', 'AED': 'د.إ', 'SAR': '﷼',
                  'TRY': '₺', 'IDR': 'Rp', 'THB': '฿', 'MYR': 'RM', 'PHP': '₱', 'DKK': 'kr', 'PLN': 'zł',
                  'CZK': 'Kč', 'HUF': 'Ft', 'ILS': '₪', 'CLP': 'CLP$', 'PKR': '₨', 'EGP': 'E£', 'NGN': '₦',
                  'VND': '₫', 'BDT': '৳', 'ARS': 'AR$', 'COP': 'COL$', 'PEN': 'S/.', 'TWD': 'NT$', 'KWD': 'د.ك',
                  'QAR': '﷼', 'OMR': '﷼', 'BHD': 'ب.د', 'JOD': 'د.ا'
                };
                const symbol = currencySymbols[currency] || '$';
                return `${symbol}${value.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: 'var(--text-light)'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'var(--border)',
              drawBorder: false
            },
            ticks: {
              color: 'var(--text-light)',
              callback: (value) => {
                const currency = localStorage.getItem('currency') || 'USD';
                const currencySymbols = {
                  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'AUD': 'A$', 'CAD': 'C$', 'CHF': 'CHF', 
                  'CNY': '¥', 'HKD': 'HK$', 'NZD': 'NZ$', 'SEK': 'kr', 'KRW': '₩', 'SGD': 'S$', 'NOK': 'kr',
                  'MXN': 'Mex$', 'INR': '₹', 'RUB': '₽', 'ZAR': 'R', 'BRL': 'R$', 'AED': 'د.إ', 'SAR': '﷼',
                  'TRY': '₺', 'IDR': 'Rp', 'THB': '฿', 'MYR': 'RM', 'PHP': '₱', 'DKK': 'kr', 'PLN': 'zł',
                  'CZK': 'Kč', 'HUF': 'Ft', 'ILS': '₪', 'CLP': 'CLP$', 'PKR': '₨', 'EGP': 'E£', 'NGN': '₦',
                  'VND': '₫', 'BDT': '৳', 'ARS': 'AR$', 'COP': 'COL$', 'PEN': 'S/.', 'TWD': 'NT$', 'KWD': 'د.ك',
                  'QAR': '﷼', 'OMR': '﷼', 'BHD': 'ب.د', 'JOD': 'د.ا'
                };
                const symbol = currencySymbols[currency] || '$';
                return value === 0 ? `${symbol}0` : `${symbol}${value}`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  /**
   * Initialize the category spending chart
   */
  initCategorySpendingChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const spendingByCategory = this.expenseTracker.getSpendingByCategory();
    const categories = this.expenseTracker.getCategories();
    
    // Filter out categories with no spending
    const labels = [];
    const data = [];
    const backgroundColors = [];
    const borderColors = [];
    
    categories.forEach((category, index) => {
      const amount = spendingByCategory[category.id];
      if (amount > 0) {
        labels.push(category.name);
        data.push(amount);
        backgroundColors.push(this.colorPalette[index % this.colorPalette.length] + '40');
        borderColors.push(this.colorPalette[index % this.colorPalette.length]);
      }
    });
    
    // If no data, show a message
    if (data.length === 0) {
      ctx.parentElement.innerHTML = `
        <div class="empty-state" style="height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <i class="fas fa-chart-pie" style="font-size: 3rem; color: var(--primary-light); margin-bottom: 1rem;"></i>
          <p>No spending data available</p>
          <p class="text-muted">Add some expenses to see category breakdown</p>
        </div>
      `;
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.charts.category) {
      this.charts.category.destroy();
    }

    this.charts.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverOffset: 10,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              color: 'var(--text)',
              font: {
                size: 13
              },
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 14, weight: '600' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                const currency = localStorage.getItem('currency') || 'USD';
                const currencySymbols = {
                  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'AUD': 'A$', 'CAD': 'C$', 'CHF': 'CHF', 
                  'CNY': '¥', 'HKD': 'HK$', 'NZD': 'NZ$', 'SEK': 'kr', 'KRW': '₩', 'SGD': 'S$', 'NOK': 'kr',
                  'MXN': 'Mex$', 'INR': '₹', 'RUB': '₽', 'ZAR': 'R', 'BRL': 'R$', 'AED': 'د.إ', 'SAR': '﷼',
                  'TRY': '₺', 'IDR': 'Rp', 'THB': '฿', 'MYR': 'RM', 'PHP': '₱', 'DKK': 'kr', 'PLN': 'zł',
                  'CZK': 'Kč', 'HUF': 'Ft', 'ILS': '₪', 'CLP': 'CLP$', 'PKR': '₨', 'EGP': 'E£', 'NGN': '₦',
                  'VND': '₫', 'BDT': '৳', 'ARS': 'AR$', 'COP': 'COL$', 'PEN': 'S/.', 'TWD': 'NT$', 'KWD': 'د.ك',
                  'QAR': '﷼', 'OMR': '﷼', 'BHD': 'ب.د', 'JOD': 'د.ا'
                };
                const symbol = currencySymbols[currency] || '$';
                return `${label}: ${symbol}${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }

  /**
   * Update all charts with the latest data
   */
  updateCharts() {
    this.initMonthlySpendingChart();
    this.initCategorySpendingChart();
  }

  /**
   * Handle window resize event
   */
  handleResize() {
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.resize();
      }
    });
  }
}

// For testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Charts };
}
