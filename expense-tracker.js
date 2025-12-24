/**
 * ExpenseTracker - Core module for managing expenses and calculations
 */

export class ExpenseTracker {
  constructor(storage) {
    this.storage = storage;
    this.expenses = this.storage.getExpenses();
    this.categories = [
      { id: 'food', name: 'Food & Dining', icon: 'utensils', color: '#3b82f6' },
      { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: '#8b5cf6' },
      { id: 'transport', name: 'Transportation', icon: 'bus', color: '#10b981' },
      { id: 'bills', name: 'Bills & Utilities', icon: 'file-invoice-dollar', color: '#f59e0b' },
      { id: 'entertainment', name: 'Entertainment', icon: 'film', color: '#ec4899' },
      { id: 'other', name: 'Other', icon: 'ellipsis-h', color: '#6b7280' }
    ];
  }

  /**
   * Add a new expense
   * @param {number} amount - The amount of the expense
   * @param {string} description - Description of the expense
   * @param {string} category - Category ID of the expense
   * @param {string} date - Date of the expense (YYYY-MM-DD format)
   * @returns {boolean} - True if the expense was added successfully
   */
  addExpense(amount, description, category, date) {
    // Validate inputs
    if (!amount || isNaN(amount) || amount <= 0 || !description || !category || !date) {
      return false;
    }

    // Create new expense object
    const expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount.toFixed(2)),
      description: description.trim(),
      category,
      date,
      createdAt: new Date().toISOString()
    };

    // Add to expenses array
    this.expenses.push(expense);
    
    // Save to storage
    this.storage.saveExpenses(this.expenses);
    
    return true;
  }

  /**
   * Remove an expense by ID
   * @param {string} id - The ID of the expense to remove
   * @returns {boolean} - True if the expense was removed successfully
   */
  removeExpense(id) {
    const initialLength = this.expenses.length;
    this.expenses = this.expenses.filter(exp => exp.id !== id);
    
    if (this.expenses.length < initialLength) {
      this.storage.saveExpenses(this.expenses);
      return true;
    }
    
    return false;
  }

  /**
   * Get all expenses
   * @returns {Array} - Array of all expenses
   */
  getAllExpenses() {
    return [...this.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Get expenses for a specific month and year
   * @param {number} month - Month (0-11)
   * @param {number} year - Year (e.g., 2023)
   * @returns {Array} - Filtered array of expenses
   */
  getExpensesForMonth(month, year) {
    return this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
  }

  /**
   * Get expenses for a specific category
   * @param {string} categoryId - The category ID to filter by
   * @returns {Array} - Filtered array of expenses
   */
  getExpensesByCategory(categoryId) {
    return this.expenses.filter(expense => expense.category === categoryId);
  }

  /**
   * Get total spending across all expenses
   * @returns {number} - Total amount spent
   */
  getTotalSpending() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  /**
   * Get today's total spending
   * @returns {number} - Total amount spent today
   */
  getTodaysSpending() {
    const today = new Date().toISOString().split('T')[0];
    return this.expenses
      .filter(expense => expense.date === today)
      .reduce((total, expense) => total + expense.amount, 0);
  }

  /**
   * Get total spending for the current month
   * @returns {number} - Total amount spent in the current month
   */
  getCurrentMonthSpending() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return this.getExpensesForMonth(currentMonth, currentYear)
      .reduce((total, expense) => total + expense.amount, 0);
  }

  /**
   * Get total spending for the previous month
   * @returns {number} - Total amount spent in the previous month
   */
  getPreviousMonthSpending() {
    const now = new Date();
    let prevMonth = now.getMonth() - 1;
    let year = now.getFullYear();
    
    if (prevMonth < 0) {
      prevMonth = 11; // December
      year--;
    }
    
    return this.getExpensesForMonth(prevMonth, year)
      .reduce((total, expense) => total + expense.amount, 0);
  }

  /**
   * Calculate the month-over-month spending change
   * @returns {number} - Percentage change from previous month
   */
  getMonthOverMonthChange() {
    const current = this.getCurrentMonthSpending();
    const previous = this.getPreviousMonthSpending();
    
    if (previous === 0) return current > 0 ? 100 : 0;
    
    return ((current - previous) / previous) * 100;
  }

  /**
   * Get spending by category
   * @returns {Object} - Object with category IDs as keys and total amounts as values
   */
  getSpendingByCategory() {
    const result = {};
    
    // Initialize all categories with 0
    this.categories.forEach(cat => {
      result[cat.id] = 0;
    });
    
    // Sum up expenses by category
    this.expenses.forEach(expense => {
      if (result.hasOwnProperty(expense.category)) {
        result[expense.category] += expense.amount;
      } else {
        // In case there's an expense with an unknown category
        result.other += expense.amount;
      }
    });
    
    return result;
  }

  /**
   * Get monthly spending data for the last 6 months
   * @returns {Array} - Array of objects with month and total spending
   */
  getMonthlySpendingData() {
    const result = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const total = this.getExpensesForMonth(month, year)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      result.push({
        month: monthName,
        total: parseFloat(total.toFixed(2))
      });
    }
    
    return result;
  }

  /**
   * Get the top spending category
   * @returns {Object} - Category with the highest spending
   */
  getTopCategory() {
    const spendingByCategory = this.getSpendingByCategory();
    let topCategory = null;
    let maxAmount = 0;
    
    Object.entries(spendingByCategory).forEach(([categoryId, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = this.categories.find(cat => cat.id === categoryId);
      }
    });
    
    return {
      ...topCategory,
      amount: maxAmount
    };
  }

  /**
   * Calculate the daily average spending
   * @returns {number} - Average daily spending
   */
  getDailyAverage() {
    if (this.expenses.length === 0) return 0;
    
    // Get the date of the first expense
    const firstExpenseDate = new Date(
      Math.min(...this.expenses.map(exp => new Date(exp.date)))
    );
    
    const today = new Date();
    const diffTime = Math.abs(today - firstExpenseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Ensure we don't divide by zero and have at least 1 day
    const days = Math.max(1, diffDays);
    
    return this.getTotalSpending() / days;
  }

  /**
   * Get recent transactions (most recent first)
   * @param {number} limit - Maximum number of transactions to return
   * @returns {Array} - Array of recent transactions
   */
  getRecentTransactions(limit = 5) {
    return [...this.expenses]
      .sort((a, b) => {
        // First try to sort by date and time using createdAt if available
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // Fall back to date only if createdAt is not available
        const dateCompare = new Date(b.date) - new Date(a.date);
        if (dateCompare !== 0) return dateCompare;
        // If dates are the same, sort by amount (higher amounts first)
        return b.amount - a.amount;
      })
      .slice(0, limit);
  }

  /**
   * Get all available categories
   * @returns {Array} - Array of category objects
   */
  getCategories() {
    return [...this.categories];
  }

  /**
   * Get a category by ID
   * @param {string} id - Category ID
   * @returns {Object} - Category object or undefined if not found
   */
  getCategoryById(id) {
    return this.categories.find(cat => cat.id === id);
  }

  /**
   * Reset all expense data
   */
  resetData() {
    this.expenses = [];
    this.storage.saveExpenses(this.expenses);
  }

  /**
   * Get statistics about expenses
   * @returns {Object} - Object containing various statistics
   */
  getStatistics() {
    const totalSpending = this.getTotalSpending();
    const currentMonthSpending = this.getCurrentMonthSpending();
    const monthOverMonthChange = this.getMonthOverMonthChange();
    const topCategory = this.getTopCategory();
    const dailyAverage = this.getDailyAverage();
    
    return {
      totalSpending,
      currentMonthSpending,
      monthOverMonthChange,
      topCategory,
      dailyAverage,
      totalTransactions: this.expenses.length
    };
  }
}

// For testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExpenseTracker };
}
