import { 
  Product, 
  Order, 
  User, 
  Statistics, 
  LoginRequest, 
  LoginResponse, 
  ApiResponse, 
  PaginationParams, 
  PaginatedResponse 
} from './models';

// API基础URL
export const API_BASE_URL = '/api';

// 认证相关接口
export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/auth/login`,
} as const;

// 产品相关接口
export const PRODUCT_API = {
  LIST: `${API_BASE_URL}/products`,
  CREATE: `${API_BASE_URL}/products`,
  UPDATE: (id: string) => `${API_BASE_URL}/products/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/products/${id}`,
} as const;

// 订单相关接口
export const ORDER_API = {
  LIST: `${API_BASE_URL}/orders`,
  CREATE: `${API_BASE_URL}/orders`,
  UPDATE: (id: string) => `${API_BASE_URL}/orders/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/orders/${id}`,
} as const;

// 统计相关接口
export const STATISTICS_API = {
  GET: `${API_BASE_URL}/statistics`,
} as const;

// API请求函数集合
export const api = {
  // 认证接口
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(AUTH_API.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 产品接口
  getProducts: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const queryString = params 
      ? `?${new URLSearchParams({
          page: params.page.toString(),
          pageSize: params.pageSize.toString()
        } as Record<string, string>)}` 
      : '';
    const response = await fetch(`${PRODUCT_API.LIST}${queryString}`);
    return response.json();
  },

  createProduct: async (data: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
    const response = await fetch(PRODUCT_API.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await fetch(PRODUCT_API.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response = await fetch(PRODUCT_API.DELETE(id), {
      method: 'DELETE',
    });
    return response.json();
  },

  // 订单接口
  getOrders: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const queryString = params 
      ? `?${new URLSearchParams({
          page: params.page.toString(),
          pageSize: params.pageSize.toString()
        } as Record<string, string>)}` 
      : '';
    const response = await fetch(`${ORDER_API.LIST}${queryString}`);
    return response.json();
  },

  createOrder: async (data: Omit<Order, 'id' | 'date' | 'revenue'>): Promise<ApiResponse<Order>> => {
    const response = await fetch(ORDER_API.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateOrder: async (id: string, data: Partial<Order>): Promise<ApiResponse<Order>> => {
    const response = await fetch(ORDER_API.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteOrder: async (id: string): Promise<ApiResponse<void>> => {
    const response = await fetch(ORDER_API.DELETE(id), {
      method: 'DELETE',
    });
    return response.json();
  },

  // 统计接口
  getStatistics: async (): Promise<ApiResponse<Statistics>> => {
    const response = await fetch(STATISTICS_API.GET);
    return response.json();
  },
}; 