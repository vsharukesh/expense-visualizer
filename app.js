// Main Application Entry Point
import { ExpenseTracker } from './expense-tracker.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { Charts } from './charts.js';
import { WelcomePopup } from './welcomePopup.js';
import { Quotes } from './quotes.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  const storage = new Storage();
  const expenseTracker = new ExpenseTracker(storage);
  const ui = new UI(expenseTracker);
  const charts = new Charts(expenseTracker);
  
  // Initialize the welcome popup
  const welcomePopup = new WelcomePopup();
  
  // Initialize the quotes
  const quotes = new Quotes();
  
  // Initialize the application
  ui.init();
  charts.init();
  quotes.init();
  
  // Set up event listeners
  setupEventListeners(ui, expenseTracker, charts);
});

/**
 * Set up all event listeners for the application
 */
function setupEventListeners(ui, expenseTracker, charts) {
  // Navigation
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      ui.showSection(targetId);
    });
  });

  // Add Expense Form
  const expenseForm = document.getElementById('expense-form');
  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const amount = parseFloat(document.getElementById('amount').value);
      const description = document.getElementById('description').value.trim();
      const category = document.getElementById('category').value;
      const date = document.getElementById('date').value;
      
      if (expenseTracker.addExpense(amount, description, category, date)) {
        // Update UI
        ui.updateDashboard();
        charts.updateCharts();
        
        // Show success message
        ui.showToast('Expense added successfully!', 'success');
        
        // Reset form
        expenseForm.reset();
        
        // Return to dashboard
        ui.showSection('dashboard');
      } else {
        ui.showToast('Please fill in all fields correctly', 'error');
      }
    });
  }

  // Cancel button in add expense form
  const cancelBtn = document.getElementById('cancel-expense');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      ui.showSection('dashboard');
    });
  }

  // Add Expense FAB
  const addExpenseFab = document.getElementById('add-expense-fab');
  if (addExpenseFab) {
    addExpenseFab.addEventListener('click', () => {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('date').value = today;
      
      // Show the add expense section
      ui.showSection('add-expense');
      
      // Focus on the amount field
      document.getElementById('amount').focus();
    });
  }

  // Add First Expense Button
  const addFirstExpenseBtn = document.getElementById('add-first-expense');
  if (addFirstExpenseBtn) {
    addFirstExpenseBtn.addEventListener('click', () => {
      ui.showSection('add-expense');
    });
  }

  // Theme Toggle
  const themeToggle = document.getElementById('dark-mode-toggle');
  if (themeToggle) {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.checked = true;
    }
    
    // Toggle theme when the switch is clicked
    themeToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Reset Data Button
  const resetDataBtn = document.getElementById('reset-data');
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all your expense data? This cannot be undone.')) {
        expenseTracker.resetData();
        ui.updateDashboard();
        charts.updateCharts();
        ui.showToast('All data has been reset', 'success');
      }
    });
  }

  // Currency Selector
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) {
    // Load saved currency or default to USD
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    currencySelect.value = savedCurrency;
    
    // Save currency preference when changed
    currencySelect.addEventListener('change', (e) => {
      localStorage.setItem('currency', e.target.value);
      // Update the UI to reflect the new currency
      ui.updateDashboard();
      charts.updateCharts();
    });
  }

  // View All Transactions Button
  const viewAllBtn = document.getElementById('view-all');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      // In a real app, this would navigate to a detailed transactions page
      ui.showToast('Viewing all transactions', 'info');
    });
  }

  // Get Started Button
  const getStartedBtn = document.querySelector('.get-started');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      ui.showSection('dashboard');
      // Smooth scroll to the dashboard section
      document.querySelector('#dashboard').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Handle window resize for responsive charts
  window.addEventListener('resize', () => {
    charts.handleResize();
  });
}

// Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupEventListeners };
}
