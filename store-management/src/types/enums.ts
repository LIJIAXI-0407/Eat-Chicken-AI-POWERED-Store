// 订单状态枚举
export enum OrderStatus {
  BROUGHT = 'Brought',      // 已购买
  PENDING = 'Pending',      // 待处理
  COMPLETED = 'Completed',  // 已完成
  CANCELLED = 'Cancelled'   // 已取消
}

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',          // 管理员
  STAFF = 'staff',          // 员工
  MANAGER = 'manager'       // 经理
}

// 产品状态枚举
export enum ProductStatus {
  ACTIVE = 'active',        // 在售
  INACTIVE = 'inactive',    // 下架
  OUT_OF_STOCK = 'out_of_stock'  // 缺货
}

// 库存预警级别枚举
export enum StockAlertLevel {
  NORMAL = 'normal',        // 正常
  LOW = 'low',             // 低库存
  CRITICAL = 'critical'     // 严重缺货
}

// 统计时间单位枚举
export enum StatisticsTimeUnit {
  HOUR = 'hour',           // 小时
  DAY = 'day',             // 天
  WEEK = 'week',           // 周
  MONTH = 'month'          // 月
}

// 支付方式枚举
export enum PaymentMethod {
  CASH = 'cash',           // 现金
  CARD = 'card',           // 刷卡
  MOBILE = 'mobile'        // 移动支付
}

// 订单类型枚举
export enum OrderType {
  RETAIL = 'retail',       // 零售
  WHOLESALE = 'wholesale'  // 批发
} 