// types/index.ts

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string | null;
  isActive?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItemSnapshot {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  items: OrderItemSnapshot[];
  total: number;
  paymentAmount: number;
  change: number;
  cashier: { name: string; email: string };
  createdAt: string;
}

export interface DashboardStats {
  totalTransactions: number;
  totalRevenue: number;
  totalItemsSold: number;
}
