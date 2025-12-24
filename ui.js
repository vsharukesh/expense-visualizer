/**
 * UI - Handles all UI updates and interactions
 */

export class UI {
  constructor(expenseTracker) {
    this.expenseTracker = expenseTracker;
    this.currentSection = 'dashboard';
    this.currency = localStorage.getItem('currency') || 'USD';
    this.currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      'CHF': 'CHF',
      'CNY': '¥',
      'HKD': 'HK$',
      'NZD': 'NZ$',
      'SEK': 'kr',
      'KRW': '₩',
      'SGD': 'S$',
      'NOK': 'kr',
      'MXN': 'Mex$',
      'INR': '₹',
      'RUB': '₽',
      'ZAR': 'R',
      'BRL': 'R$',
      'AED': 'د.إ',
      'SAR': '﷼',
      'TRY': '₺',
      'IDR': 'Rp',
      'THB': '฿',
      'MYR': 'RM',
      'PHP': '₱',
      'DKK': 'kr',
      'PLN': 'zł',
      'CZK': 'Kč',
      'HUF': 'Ft',
      'ILS': '₪',
      'CLP': 'CLP$',
      'PKR': '₨',
      'EGP': 'E£',
      'NGN': '₦',
      'VND': '₫',
      'BDT': '৳',
      'ARS': 'AR$',
      'COP': 'COL$',
      'PEN': 'S/.',
      'TWD': 'NT$',
      'KWD': 'د.ك',
      'QAR': '﷼',
      'OMR': '﷼',
      'BHD': 'ب.د',
      'JOD': 'د.ا'
    };
  }

  /**
   * Initialize the UI
   */
  init() {
    // Set today's date as default in the date picker
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.value = today;
      dateInput.max = today; // Prevent future dates
    }

    // Set up currency from storage
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
      // Set the saved currency or default to USD
      this.currency = localStorage.getItem('currency') || 'USD';
      
      // Set the selected value in the dropdown
      if (currencySelect.querySelector(`option[value="${this.currency}"]`)) {
        currencySelect.value = this.currency;
      } else {
        // If saved currency is not in the list, default to USD
        this.currency = 'USD';
        currencySelect.value = 'USD';
        localStorage.setItem('currency', 'USD');
      }
      
      // Update currency when changed
      currencySelect.addEventListener('change', (e) => {
        this.currency = e.target.value;
        localStorage.setItem('currency', this.currency);
        this.updateDashboard();
        this.updateCurrencySymbol();
        // Show a toast notification about the currency change
        this.showToast(`Currency changed to ${this.currency} (${this.currencySymbols[this.currency] || ''})`, 'success');
      });
      
      // Initialize currency symbol
      this.updateCurrencySymbol();
    }

    // Initial UI update
    this.updateDashboard();
    this.setupEventListeners();
  }

  /**
   * Set up event listeners for UI elements
   */
  setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
    }
  }

  /**
   * Show a specific section and hide others
   * @param {string} sectionId - ID of the section to show
   */
  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });

    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      this.currentSection = sectionId;
      
      // Update the active nav link
      this.updateActiveNavLink(sectionId);
      
      // If showing dashboard or insights, update the data
      if (sectionId === 'dashboard' || sectionId === 'insights') {
        this.updateDashboard();
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Update the active state of navigation links
   * @param {string} activeId - ID of the active section
   */
  updateActiveNavLink(activeId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Update the dashboard with the latest data
   */
  updateDashboard() {
    this.updateHeroSection();
    this.updateTotalSpending();
    this.updateRecentTransactions();
    this.updateCategoryList();
    this.updateInsights();
  }
  
  /**
   * Update the hero section with spending statistics
   */
  updateHeroSection() {
    // Get current date information
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // 1. Today's Spending
    const todaysSpending = this.expenseTracker.getTodaysSpending();
    const todaySpendingElement = document.querySelector('#today-spending .amount');
    if (todaySpendingElement) {
      todaySpendingElement.textContent = todaysSpending.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    // 2. Monthly Spending
    const currentMonthSpending = this.expenseTracker.getCurrentMonthSpending();
    const monthlySpendingElement = document.querySelector('#monthly-spending .amount');
    if (monthlySpendingElement) {
      monthlySpendingElement.textContent = currentMonthSpending.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    // 3. Average Daily Spend (for current month)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const avgDailySpend = currentMonthSpending / Math.min(currentDay, daysInMonth);
    const avgDailySpendElement = document.querySelector('#avg-daily-spend .amount');
    if (avgDailySpendElement) {
      avgDailySpendElement.textContent = avgDailySpend.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    // Update currency symbols
    this.updateHeroCurrencySymbols();
  }
  
  /**
   * Update currency symbols in the hero section
   */
  updateHeroCurrencySymbols() {
    const symbol = this.currencySymbols[this.currency] || '$';
    const symbolElements = document.querySelectorAll('.hero .currency-symbol');
    
    symbolElements.forEach(el => {
      el.textContent = symbol;
    });
  }

  /**
   * Update the total spending display to show current month's expenses
   */
  updateTotalSpending() {
    // Get current month's spending instead of total spending
    const currentMonthSpending = this.expenseTracker.getCurrentMonthSpending();
    const totalElement = document.getElementById('total-amount');
    
    if (totalElement) {
      totalElement.textContent = this.formatCurrency(currentMonthSpending);
    }
    
    // Update month-over-month change
    const monthChange = this.expenseTracker.getMonthOverMonthChange();
    const trendElement = document.querySelector('.trend');
    
    if (trendElement) {
      const isPositive = monthChange >= 0;
      const icon = isPositive ? 'arrow-up' : 'arrow-down';
      const absChange = Math.abs(monthChange).toFixed(1);
      
      trendElement.innerHTML = `
        <span class="trend-${isPositive ? 'up' : 'down'}">
          <i class="fas fa-${icon}"></i> ${absChange}% from last month
        </span>
      `;
    }
  }

  /**
   * Update the recent transactions list
   */
  updateRecentTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    if (!transactionsList) return;
    
    const recentTransactions = this.expenseTracker.getRecentTransactions(5);
    
    if (recentTransactions.length === 0) {
      transactionsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-receipt"></i>
          <p>No transactions yet</p>
          <button class="btn btn-outline" id="add-first-expense">Add Your First Expense</button>
        </div>
      `;
      
      // Re-attach event listener to the button
      const addFirstBtn = document.getElementById('add-first-expense');
      if (addFirstBtn) {
        addFirstBtn.addEventListener('click', () => this.showSection('add-expense'));
      }
      
      return;
    }
    
    transactionsList.innerHTML = '';
    
    recentTransactions.forEach((transaction, index) => {
      const category = this.expenseTracker.getCategoryById(transaction.category) || 
                     { name: 'Other', icon: 'ellipsis-h', color: '#6b7280' };
      
      const transactionElement = document.createElement('div');
      transactionElement.className = 'transaction-item';
      transactionElement.style.animationDelay = `${index * 0.1}s`;
      
      transactionElement.innerHTML = `
        <div class="transaction-info">
          <div class="transaction-icon" style="background-color: ${category.color}20; color: ${category.color}">
            <i class="fas fa-${category.icon}"></i>
          </div>
          <div class="transaction-details">
            <h4>${transaction.description}</h4>
            <div class="transaction-category" style="color: ${category.color}">
              ${category.name}
            </div>
          </div>
        </div>
        <div class="transaction-amount">${this.formatCurrency(transaction.amount)}</div>
      `;
      
      transactionsList.appendChild(transactionElement);
    });
    
    // Add animation to transaction items
    const transactionItems = document.querySelectorAll('.transaction-item');
    transactionItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  }

  /**
   * Update the category list with spending breakdown
   */
  updateCategoryList() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) return;
    
    const spendingByCategory = this.expenseTracker.getSpendingByCategory();
    const totalSpending = this.expenseTracker.getTotalSpending();
    
    // Clear existing content
    categoryList.innerHTML = '';
    
    // Add each category with its spending
    this.expenseTracker.getCategories().forEach(category => {
      const amount = spendingByCategory[category.id] || 0;
      if (amount <= 0) return; // Skip categories with no spending
      
      const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
      
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category-item';
      
      categoryElement.innerHTML = `
        <div class="category-info">
          <div class="category-icon" style="background-color: ${category.color}20; color: ${category.color}">
            <i class="fas fa-${category.icon}"></i>
          </div>
          <div>
            <div class="category-name">${category.name}</div>
            <div class="category-percentage" style="color: ${category.color}">
              ${percentage.toFixed(1)}%
            </div>
          </div>
        </div>
        <div class="category-amount">${this.formatCurrency(amount)}</div>
      `;
      
      categoryList.appendChild(categoryElement);
    });
    
    // If no categories with spending, show a message
    if (categoryList.children.length === 0) {
      categoryList.innerHTML = `
        <div class="empty-state" style="padding: 1rem 0;">
          <i class="fas fa-chart-pie" style="font-size: 1.5rem;"></i>
          <p>No spending data yet</p>
        </div>
      `;
    }
  }

  /**
   * Update the insights section with latest data
   */
  updateInsights() {
    const stats = this.expenseTracker.getStatistics();
    
    // Update top category
    const topCategoryElement = document.getElementById('top-category');
    if (topCategoryElement) {
      if (stats.topCategory) {
        topCategoryElement.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="category-icon" style="background-color: ${stats.topCategory.color}20; color: ${stats.topCategory.color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
              <i class="fas fa-${stats.topCategory.icon}"></i>
            </span>
            <span>${stats.topCategory.name}</span>
            <span style="font-weight: 600;">${this.formatCurrency(stats.topCategory.amount)}</span>
          </div>
        `;
      } else {
        topCategoryElement.textContent = 'No data';
      }
    }
    
    // Update daily average
    const dailyAverageElement = document.getElementById('daily-average');
    if (dailyAverageElement) {
      dailyAverageElement.textContent = this.formatCurrency(stats.dailyAverage);
    }
    
    // Update month change
    const monthChangeElement = document.getElementById('month-change');
    if (monthChangeElement) {
      const isPositive = stats.monthOverMonthChange >= 0;
      monthChangeElement.innerHTML = `
        <span style="color: ${isPositive ? '#10b981' : '#ef4444'};">
          ${isPositive ? '+' : ''}${stats.monthOverMonthChange.toFixed(1)}%
        </span>
      `;
    }
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - The type of toast (success, error, info)
   * @param {number} duration - Duration in milliseconds (default: 3000ms)
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Set the message and type
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show the toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Hide the toast after the specified duration
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /**
   * Format a number as currency
   * @param {number} amount - The amount to format
   * @returns {string} - Formatted currency string
   */
  formatCurrency(amount) {
    const symbol = this.currencySymbols[this.currency] || '$';
    return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }
  
  /**
   * Update the currency symbol in the add expense form
   */
  updateCurrencySymbol() {
    const currencySymbol = document.getElementById('currency-symbol');
    if (currencySymbol) {
      currencySymbol.textContent = this.currencySymbols[this.currency] || '$';
    }
  }
}

// For testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UI };
}
