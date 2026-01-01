export interface User {
  user_id: string;
  name: string;
  created_at: string;
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
    [plan_key: string]: {
      id: string;
      name: string;
    };
  };
}

export interface Category {
  name: string;
  display_order?: number;
  products: {
    [product_key: string]: Product;
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
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_step?: string;
  started_at: string;
  estimated_completion?: string;
  plans: {
    [plan_key: string]: {
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress: number;
      current_step?: string;
      api_calls?: Array<{
        endpoint: string;
        method: string;
        status_code: number;
        response_time_ms: number;
      }>;
      error?: string;
    };
  };
  target_env: string;
  baseline_env: string;
}

export interface APIError {
  detail: string;
}