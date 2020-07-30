export interface Order {
  id: number;
  orderedAt: string;
  status: OrderStatus;
  orderItems: OrderItem[];
  total: number;
  subTotal: number;
  tax: number;
}

export enum OrderStatus {
  Pending = "pending",
  Shipped = "shipped",
  Delivered = "delivered",
  Canceled = "canceled",
  Delayed = "delayed",
}

export interface OrderItem {
  productName: string;
  productId: number;
  qty: number;
  price: number;
  image: string;
}
