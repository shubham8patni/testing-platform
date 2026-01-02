export interface User {
  user_id: string;
  name: string;
  created_at: string;
  last_login: string;
}

export interface Environment {
  name: string;
  base_url: string;
  auth: {
    type: string;
    token_field: string;
  };
}

export interface Product {
  id: string;
  name: string;
  plans: {
    [key: string]: {
      id: string;
      name: string;
      test_sequence: string[];
    };
  };
}

export interface Category {
  [key: string]: {
    name: string;
    display_order: number;
    products: {
      [key: string]: Product;
    };
  };
}

export interface TestConfig {
  user_id: string;
  target_env: string;
  baseline_env: string;
  scope: {
    type: 'all' | 'category' | 'product' | 'plan';
    value?: string;
  };
  admin_token: string;
  customer_token: string;
  ai_prompt: string;
}

export interface TestProgress {
  test_id: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  current_step: string | null;
  started_at: string;
  plans: {
    [plan_key: string]: {
      status: string;
      progress: number;
      current_step: string | null;
      error?: string;
    };
  };
}

export interface TestResult {
  test_id: string;
  test_metadata: {
    test_id: string;
    user_id: string;
    started_at: string;
    status: string;
    scope: TestConfig['scope'];
    environments: {
      target: string;
      baseline: string;
    };
    ai_prompt: string;
  };
  execution_summary: {
    total_plans: number;
    completed_plans: number;
    failed_plans: number;
    total_api_calls: number;
    execution_time_minutes: number;
  };
  plan_results: {
    [plan_key: string]: {
      status: string;
      api_calls: any[];
      error?: string;
      environment_comparison: any;
    };
  };
}

export interface TestStatusResponse {
  test_id: string;
  status: string;
  progress: number;
  current_step: string | null;
  started_at: string;
  plans: TestProgress['plans'];
  target_env: string;
  baseline_env: string;
}