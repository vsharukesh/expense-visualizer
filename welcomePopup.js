/**
 * Welcome Popup Module
 * Handles the display and animation of the welcome popup
 */

export class WelcomePopup {
    constructor() {
        this.popup = document.getElementById('welcomePopup');
        this.getStartedBtn = document.getElementById('getStartedBtn');
        
        this.init();
    }

    init() {
        // Show popup on every page load
        this.showPopup();

        // Add event listener for the get started button
        if (this.getStartedBtn) {
            this.getStartedBtn.addEventListener('click', () => this.hidePopup());
        }

        // Close popup when clicking outside the content
        this.popup?.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.hidePopup();
            }
        });
    }

    showPopup() {
        if (!this.popup) return;
        
        // Add show class to display the popup
        setTimeout(() => {
            this.popup.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
        }, 1000); // Small delay to ensure the page has loaded
    }

    hidePopup() {
        if (!this.popup) return;
        
        // Add fade out animation
        this.popup.style.opacity = '0';
        this.popup.style.visibility = 'hidden';
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // No need to store in localStorage as we want to show it every time
    }

    // Method to reset the popup (for testing)
    reset() {
        localStorage.removeItem('welcomeShown');
        this.hasShown = false;
        this.popup.style.opacity = '1';
        this.popup.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }
}
