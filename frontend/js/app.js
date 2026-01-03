// Main Application JavaScript

class InsuranceTestingPlatform {
  constructor() {
    this.currentUser = null;
    this.currentTest = null;
    this.apiBase = 'http://localhost:8000/api/v1';
    this.init();
  }

  async init() {
    this.showPage('welcome');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Navigation handlers
    document.getElementById('welcome-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUserCreation();
    });

    document.getElementById('test-config-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTestStart();
    });

    // Navigation handlers
    document.getElementById('new-test-btn')?.addEventListener('click', () => {
      this.showPage('test-config');
    });

    document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
      this.showPage('dashboard');
    });

    // Progress polling
    document.getElementById('view-results-btn')?.addEventListener('click', () => {
      this.showPage('results');
    });
  }

  // API Service Methods
  async apiCall(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.apiBase}${endpoint}`, options);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User Management
  async handleUserCreation() {
    const nameInput = document.getElementById('user-name');
    const name = nameInput.value.trim();
    
    if (!name) {
      this.showAlert('Please enter your name');
      return;
    }

    try {
      const result = await this.apiCall('/users', 'POST', { name });
      this.currentUser = result;
      this.showAlert(`Welcome ${name}!`, 'success');
      this.showPage('dashboard');
    } catch (error) {
      this.showAlert(error.message || 'Failed to create user', 'error');
    }
  }

  // Test Management
  async handleTestStart() {
    const config = this.getTestConfig();
    
    if (!config.admin_token || !config.customer_token) {
      this.showAlert('Both tokens are required for demo', 'warning');
      return;
    }

    try {
      const result = await this.apiCall('/tests/start', 'POST', config);
      this.currentTest = result.test_id;
      this.showAlert('Test started successfully!', 'success');
      this.showPage('progress');
      this.startProgressPolling(result.test_id);
    } catch (error) {
      this.showAlert(error.message || 'Failed to start test', 'error');
    }
  }

  getTestConfig() {
    return {
      user_id: this.currentUser?.user_id || 'demo_user',
      target_env: document.getElementById('target-env')?.value || 'qa',
      baseline_env: document.getElementById('baseline-env')?.value || 'stage',
      scope: {
        type: document.getElementById('test-scope')?.value || 'all'
      },
      admin_token: document.getElementById('admin-token')?.value || 'demo_token',
      customer_token: document.getElementById('customer-token')?.value || 'demo_token',
      ai_prompt: document.getElementById('ai-prompt')?.value || 'Focus on pricing differences'
    };
  }

  // Progress Tracking
  startProgressPolling(testId) {
    const pollInterval = setInterval(async () => {
      try {
        const progress = await this.apiCall(`/tests/${testId}/status`);
        this.updateProgressDisplay(progress);
        
        if (progress.status === 'completed') {
          clearInterval(pollInterval);
          this.currentTestResults = progress;
          document.getElementById('view-results-btn')?.classList.remove('hidden');
        } else if (progress.status === 'failed') {
          clearInterval(pollInterval);
          this.showAlert('Test failed. Please check configuration.', 'error');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);
  }

  updateProgressDisplay(progress) {
    const overallProgress = document.getElementById('overall-progress');
    const currentStep = document.getElementById('current-step');
    const plansContainer = document.getElementById('plans-progress');
    
    if (overallProgress) {
      overallProgress.style.width = `${progress.progress}%`;
      overallProgress.textContent = `${progress.progress}%`;
    }
    
    if (currentStep) {
      currentStep.textContent = progress.current_step || 'Initializing...';
    }
    
    if (plansContainer && progress.plans) {
      plansContainer.innerHTML = '';
      Object.entries(progress.plans).forEach(([planKey, planData]) => {
        const planElement = this.createPlanElement(planKey, planData);
        plansContainer.appendChild(planElement);
      });
    }
  }

  createPlanElement(planKey, planData) {
    const div = document.createElement('div');
    div.className = 'plan-card';
    div.innerHTML = `
      <div class="plan-header">
        <strong>${planKey}</strong>
        <span class="status-badge status-${planData.status}">${planData.status}</span>
      </div>
      <div class="plan-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${planData.progress}%"></div>
        </div>
        <small>${planData.progress}%</small>
      </div>
      ${planData.error ? `<div class="error-message">${planData.error}</div>` : ''}
    `;
    return div;
  }

  // Results Display
  async loadTestResults(testId) {
    try {
      const results = await this.apiCall(`/results/${testId}`);
      this.displayResults(results);
    } catch (error) {
      this.showAlert('Failed to load results', 'error');
    }
  }

  displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
      <div class="results-header">
        <h3>Test Results: ${results.test_id}</h3>
        <div class="test-summary">
          <div class="summary-item">
            <strong>Total Plans:</strong> ${results.execution_summary?.total_plans || 0}
          </div>
          <div class="summary-item">
            <strong>Completed:</strong> <span class="text-success">${results.execution_summary?.completed_plans || 0}</span>
          </div>
          <div class="summary-item">
            <strong>Failed:</strong> <span class="text-danger">${results.execution_summary?.failed_plans || 0}</span>
          </div>
        </div>
      </div>
      <div class="plans-results">
        ${this.createPlanResultsHtml(results.plan_results || {})}
      </div>
    `;
  }

  createPlanResultsHtml(planResults) {
    return Object.entries(planResults).map(([planKey, planData]) => `
      <div class="plan-result-card">
        <div class="plan-result-header">
          <h4>${planKey}</h4>
          <span class="status-badge status-${planData.status}">${planData.status}</span>
        </div>
        <div class="plan-details">
          <div class="api-calls">
            <strong>API Calls: ${planData.api_calls?.length || 0}</strong>
          </div>
          ${planData.error ? `<div class="error-details">${planData.error}</div>` : ''}
          <div class="comparison-status">
            <strong>Comparison: ${planData.environment_comparison?.status || 'N/A'}</strong>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Page Management
  showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    // Show selected page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      this.updateNavigation(page);
    }
  }

  updateNavigation(currentPage) {
    // Update navigation state
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`[data-page="${currentPage}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  // Utility Methods
  showAlert(message, type = 'info') {
    const alertDiv = document.getElementById('alert-message');
    if (!alertDiv) return;

    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.classList.remove('hidden');
    
    setTimeout(() => {
      alertDiv.classList.add('hidden');
    }, 5000);
  }

  showUserTests() {
    // Mock user tests for dashboard
    const testsContainer = document.getElementById('user-tests');
    if (testsContainer) {
      testsContainer.innerHTML = `
        <div class="no-tests-message">
          <h4>Welcome to the Insurance Testing Platform!</h4>
          <p>Create your first test to see your test history here.</p>
          <button class="btn btn-primary" onclick="app.showPage('test-config')">
            Start Your First Test
          </button>
        </div>
      `;
    }
  }
}

// Global instance
window.app = new InsuranceTestingPlatform();