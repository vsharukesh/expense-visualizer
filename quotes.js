/**
 * Quotes - Handles the display of inspirational quotes
 */

export class Quotes {
  constructor() {
    this.quotes = [
      {
        text: "The habit of saving is itself an education.",
        author: "T.T. Munger"
      },
      {
        text: "Do not save what is left after spending, but spend what is left after saving.",
        author: "Warren Buffett"
      },
      {
        text: "A budget tells us what we can't afford, but it doesn't keep us from buying it.",
        author: "William Feather"
      },
      {
        text: "Beware of little expenses; a small leak will sink a great ship.",
        author: "Benjamin Franklin"
      },
      {
        text: "The art is not in making money, but in keeping it.",
        author: "Proverb"
      },
      {
        text: "It's not how much money you make, but how much money you keep.",
        author: "Robert Kiyosaki"
      },
      {
        text: "The goal isn't more money. The goal is living life on your terms.",
        author: "Chris Reining"
      },
      {
        text: "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
        author: "Ayn Rand"
      },
      {
        text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
        author: "Philip Fisher"
      },
      {
        text: "An investment in knowledge pays the best interest.",
        author: "Benjamin Franklin"
      },
      {
        text: "The four most dangerous words in investing are: 'This time it's different.'",
        author: "Sir John Templeton"
      },
      {
        text: "The most important quality for an investor is temperament, not intellect.",
        author: "Warren Buffett"
      },
      {
        text: "Do not put all your eggs in one basket.",
        author: "Miguel de Cervantes"
      },
      {
        text: "The individual investor should act consistently as an investor and not as a speculator.",
        author: "Benjamin Graham"
      },
      {
        text: "In investing, what is comfortable is rarely profitable.",
        author: "Robert Arnott"
      },
      {
        text: "The biggest risk of all is not taking one.",
        author: "Mellody Hobson"
      },
      {
        text: "The stock market is a device for transferring money from the impatient to the patient.",
        author: "Warren Buffett"
      },
      {
        text: "Opportunities come infrequently. When it rains gold, put out the bucket, not the thimble.",
        author: "Warren Buffett"
      },
      {
        text: "The most important investment you can make is in yourself.",
        author: "Warren Buffett"
      },
      {
        text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
        author: "Dave Ramsey"
      },
      {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb"
      },
      {
        text: "The more you learn, the more you earn.",
        author: "Warren Buffett"
      },
      {
        text: "Never spend your money before you have it.",
        author: "Thomas Jefferson"
      },
      {
        text: "The secret to getting ahead is getting started.",
        author: "Mark Twain"
      },
      {
        text: "The only way to permanently take the tension out of money management is to get out of the debt habit.",
        author: "Mary Hunt"
      },
      {
        text: "A man who does not plan long ahead will find trouble at his door.",
        author: "Confucius"
      },
      {
        text: "The best way to predict your future is to create it.",
        author: "Peter Drucker"
      },
      {
        text: "The more your money works for you, the less you have to work for money.",
        author: "Idowu Koyenikan"
      },
      {
        text: "Financial freedom is available to those who learn about it and work for it.",
        author: "Robert Kiyosaki"
      },
      {
        text: "The best investment you can make is in your own abilities. Anything you can do to develop your own abilities or business is likely to be more productive.",
        author: "Warren Buffett"
      },
      {
        text: "The more you learn, the more you'll earn. The more you earn, the more you can save and invest.",
        author: "Robert Kiyosaki"
      },
      {
        text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought.",
        author: "T.T. Munger"
      },
      {
        text: "The art is not in making money, but in keeping it, in making it bear fruit, and in getting it when you need it.",
        author: "Proverb"
      },
      {
        text: "The quickest way to double your money is to fold it in half and put it back in your pocket.",
        author: "Will Rogers"
      },
      {
        text: "The only thing that interferes with my learning is my education.",
        author: "Albert Einstein"
      },
      {
        text: "The more you learn, the more you'll realize what you don't know.",
        author: "Albert Einstein"
      },
      {
        text: "The best time to start was yesterday. The next best time is now.",
        author: "Chinese Proverb"
      },
      {
        text: "The more you give, the more comes back to you.",
        author: "Rhonda Byrne"
      },
      {
        text: "The best way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
      },
      {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
      },
      {
        text: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson"
      },
      {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu"
      },
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      },
      {
        text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
        author: "Helen Keller"
      },
      {
        text: "The only true wisdom is in knowing you know nothing.",
        author: "Socrates"
      },
      {
        text: "The best preparation for tomorrow is doing your best today.",
        author: "H. Jackson Brown Jr."
      },
      {
        text: "The only source of knowledge is experience.",
        author: "Albert Einstein"
      },
      {
        text: "The best and most efficient pharmacy is within your own system.",
        author: "Robert C. Peale"
      },
      {
        text: "The only thing we have to fear is fear itself.",
        author: "Franklin D. Roosevelt"
      }
    ];
    
    this.currentIndex = 0;
    this.interval = null;
    this.quoteElement = document.querySelector('.quote-text');
    this.authorElement = document.querySelector('.quote-author');
  }

  /**
   * Initialize the quotes functionality
   */
  init() {
    if (!this.quoteElement || !this.authorElement) return;
    
    // Show the first quote immediately
    this.showQuote();
    
    // Change quote every 10 seconds
    this.interval = setInterval(() => this.nextQuote(), 10000);
    
    // Add event listeners for manual navigation (optional)
    this.addEventListeners();
  }

  /**
   * Show the current quote
   */
  showQuote() {
    const quote = this.quotes[this.currentIndex];
    this.quoteElement.textContent = `"${quote.text}"`;
    this.authorElement.textContent = `- ${quote.author}`;
    
    // Trigger animation
    this.animateQuote();
  }

  /**
   * Show the next quote
   */
  nextQuote() {
    this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    this.showQuote();
  }

  /**
   * Show the previous quote
   */
  prevQuote() {
    this.currentIndex = (this.currentIndex - 1 + this.quotes.length) % this.quotes.length;
    this.showQuote();
  }

  /**
   * Animate the quote transition
   */
  animateQuote() {
    const container = document.querySelector('.quote-container');
    if (!container) return;
    
    // Reset animation
    container.style.animation = 'none';
    container.offsetHeight; // Trigger reflow
    
    // Apply animation
    container.style.animation = 'fadeInUp 0.5s ease-out forwards';
  }

  /**
   * Add event listeners for manual navigation (optional)
   */
  addEventListeners() {
    // Add click handlers for next/previous navigation if needed
    this.quoteElement.style.cursor = 'pointer';
    this.quoteElement.addEventListener('click', () => this.nextQuote());
  }

  /**
   * Clean up intervals when needed
   */
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// For testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Quotes };
}
