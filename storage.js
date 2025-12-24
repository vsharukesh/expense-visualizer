/**
 * Storage - Handles all data persistence using localStorage
 */

export class Storage {
  constructor() {
    this.EXPENSES_KEY = 'expense_tracker_expenses';
    this.SETTINGS_KEY = 'expense_tracker_settings';
    this.DEFAULT_SETTINGS = {
      currency: 'USD',
      theme: 'light'
    };
  }

  /**
   * Get all expenses from storage
   * @returns {Array} - Array of expense objects
   */
  getExpenses() {
    try {
      const expenses = localStorage.getItem(this.EXPENSES_KEY);
      return expenses ? JSON.parse(expenses) : [];
    } catch (error) {
      console.error('Error reading expenses from storage:', error);
      return [];
    }
  }

  /**
   * Save expenses to storage
   * @param {Array} expenses - Array of expense objects to save
   */
  saveExpenses(expenses) {
    try {
      localStorage.setItem(this.EXPENSES_KEY, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error('Error saving expenses to storage:', error);
      return false;
    }
  }

  /**
   * Get user settings
   * @returns {Object} - User settings object
   */
  getSettings() {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : { ...this.DEFAULT_SETTINGS };
    } catch (error) {
      console.error('Error reading settings from storage:', error);
      return { ...this.DEFAULT_SETTINGS };
    }
  }

  /**
   * Save user settings
   * @param {Object} settings - Settings object to save
   */
  saveSettings(settings) {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
      return true;
    } catch (error) {
      console.error('Error saving settings to storage:', error);
      return false;
    }
  }

  /**
   * Get a specific setting
   * @param {string} key - Setting key
   * @param {*} defaultValue - Default value if setting doesn't exist
   * @returns {*} - The setting value or default value
   */
  getSetting(key, defaultValue = null) {
    const settings = this.getSettings();
    return settings.hasOwnProperty(key) ? settings[key] : defaultValue;
  }

  /**
   * Save a specific setting
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   */
  saveSetting(key, value) {
    return this.saveSettings({ [key]: value });
  }

  /**
   * Clear all data from storage
   */
  clearAll() {
    try {
      localStorage.removeItem(this.EXPENSES_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean} - True if storage is available
   */
  isStorageAvailable() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        localStorage.length !== 0;
    }
  }
}

// For testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Storage };
}
