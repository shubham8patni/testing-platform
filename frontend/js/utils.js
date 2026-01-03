// Utility functions

const Utils = {
  // Format date and time
  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  },

  // Generate color for status
  getStatusColor(status) {
    const colors = {
      'running': '#17a2b8',
      'completed': '#28a745',
      'failed': '#dc3545',
      'diff': '#ffc107',
      'match': '#17a2b8',
      'warning': '#ffc107',
      'success': '#28a745',
      'danger': '#dc3545',
      'info': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  },

  // Create status badge HTML
  createStatusBadge(status) {
    return `<span class="status-badge" style="background-color: ${this.getStatusColor(status)}">
      ${status.toUpperCase()}
    </span>`;
  },

  // Show loading state
  showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="loading-container">
          <div class="spinner"></div>
          <div class="loading-text">${message}</div>
        </div>
      `;
    }
  },

  // Hide loading state
  hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  },

  // Format API call for display
  formatApiCall(call, index) {
    return `
      <div class="api-call">
        <div class="api-header">
          <span class="method-badge">${call.method || 'GET'}</span>
          <span class="endpoint">${call.endpoint || '/unknown'}</span>
          <span class="status-code">${call.status_code || 200}</span>
        </div>
        <div class="api-details">
          <div class="response-time">${call.response_time_ms || 0}ms</div>
          <div class="timestamp">${this.formatDateTime(call.timestamp)}</div>
        </div>
        ${call.response ? `
          <div class="api-response">
            <strong>Response:</strong>
            <pre>${JSON.stringify(call.response, null, 2)}</pre>
          </div>
        ` : ''}
      </div>
    `;
  },

  // Create progress bar
  createProgressBar(progress, status = 'normal') {
    return `
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill ${status}" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">${progress}%</div>
      </div>
    `;
  },

  // Create mock plan results
  createMockPlanResults() {
    const plans = [
      'car:zurich_autocillin_mv4:tlo',
      'car:zurich_autocillin_mv4:comprehensive',
      'travel:international:single_trip',
      'health:family:hmo'
    ];

    return plans.map(plan => ({
      [plan]: {
        status: Math.random() > 0.2 ? 'completed' : Math.random() > 0.5 ? 'failed' : 'running',
        progress: Math.floor(Math.random() * 100),
        api_calls: Array.from({length: Math.floor(Math.random() * 4) + 2}, (_, i) => ({
          method: 'POST',
          endpoint: '/api/v1/submit',
          status_code: 200,
          response_time_ms: Math.floor(Math.random() * 500) + 100,
          timestamp: new Date().toISOString(),
          response: {
            status: 'success',
            data: `Mock response for ${plan}`
          }
        })),
        environment_comparison: {
          status: Math.random() > 0.5 ? 'match' : 'diff',
          target_summary: { api_calls: 3, total_response_time: 450 },
          baseline_summary: { api_calls: 3, total_response_time: 480 }
        }
      }
    }));
  }
};