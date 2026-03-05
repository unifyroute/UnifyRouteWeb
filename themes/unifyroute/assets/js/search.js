// Search functionality with Lunr.js
class SearchManager {
  constructor() {
    this.index = null;
    this.documents = [];
    this.searchInput = null;
    this.searchResults = null;
    this.init();
  }

  async init() {
    // Load search data
    try {
      // Get the base URL - it should be set by the template or default to root
      const baseUrl = window.HUGO_BASE_URL || '';
      const indexUrl = (baseUrl + 'search-index.json').replace(/\/+/g, '/');

      const response = await fetch(indexUrl);
      if (!response.ok) throw new Error('Failed to fetch search index');
      const data = await response.json();
      this.documents = data.documents;

      // Build Lunr index
      this.index = lunr(function() {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('section');

        data.documents.forEach(doc => {
          this.add(doc);
        });
      });

      this.setupSearchUI();
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }

  setupSearchUI() {
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');

    if (this.searchInput && this.searchResults) {
      this.searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
      this.searchInput.addEventListener('focus', () => {
        this.searchResults.style.display = 'block';
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
          this.searchResults.style.display = 'none';
        }
      });
    }
  }

  performSearch(query) {
    if (!query.trim() || !this.index) {
      this.searchResults.innerHTML = '';
      this.searchResults.style.display = 'none';
      return;
    }

    // Search with fuzzy matching
    const results = this.index.search(`${query}*`);
    this.displayResults(results);
  }

  displayResults(results) {
    if (results.length === 0) {
      this.searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }

    const html = results.slice(0, 10).map(result => {
      const doc = this.documents.find(d => d.id === result.ref);
      return `
        <a href="${doc.url}" class="search-result">
          <div class="search-result-title">${this.highlightQuery(doc.title, this.searchInput.value)}</div>
          <div class="search-result-section">${doc.section}</div>
          <div class="search-result-excerpt">${this.highlightQuery(doc.excerpt, this.searchInput.value)}</div>
        </a>
      `;
    }).join('');

    this.searchResults.innerHTML = html;
  }

  highlightQuery(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }
}

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lunr !== 'undefined') {
    window.searchManager = new SearchManager();
  }
});
