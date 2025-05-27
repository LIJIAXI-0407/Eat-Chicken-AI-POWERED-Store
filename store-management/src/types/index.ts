// 重新导出所有类型定义
export * from './enums';
export * from './api';

import { 
  OrderStatus, 
  UserRole, 
  ProductStatus, 
  StockAlertLevel, 
  PaymentMethod, 
  OrderType 
} from './enums';

// 产品接口定义
export interface Product {
  id: string;                // 产品ID，3位数字字符串
  name: string;              // 产品名称
  barcode: string;           // 条形码
  price: number;             // 价格
  stock: number;             // 库存数量
  status: ProductStatus;     // 产品状态
  alertLevel: StockAlertLevel; // 库存预警级别
}

// 订单接口定义
export interface Order {
  id: string;                // 订单ID
  revenue: number;           // 收入金额
  date: string;              // 订单日期时间
  product: string;           // 产品名称
  customer: string;          // 客户名称
  amount: number;            // 购买数量
  status: OrderStatus;       // 订单状态
  paymentMethod: PaymentMethod; // 支付方式
  orderType: OrderType;      // 订单类型
}

// 用户接口定义
export interface User {
  id: string;                // 用户ID
  username: string;          // 用户名
  role: UserRole;            // 用户角色
}

// 统计数据接口定义
export interface Statistics {
  peopleCount: number;    // 人数统计
  averageTime: number;    // 平均时间
}

// API响应接口定义
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 登录请求接口定义
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应接口定义
export interface LoginResponse {
  token: string;
  user: User;
}

// 分页请求参数接口定义
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应接口定义
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 