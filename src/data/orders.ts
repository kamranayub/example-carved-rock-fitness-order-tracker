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

const orders: Order[] = [
  {
    id: 1001,
    orderedAt: "2020-05-26T09:00:00-0500",
    status: OrderStatus.Pending,
    orderItems: [
      {
        productId: 900,
        productName: "XtraTuff Men's Hiking Books",
        price: 35,
        qty: 1,
        image: "",
      },
      {
        productId: 900,
        productName: "Backpacker's Guide to Colorado Hiking Trails",
        price: 21,
        qty: 1,
        image: "",
      },
    ],
    total: 56,
    subTotal: 52,
    tax: 4,
  },
];

export function getOrders() {
  return new Promise<Order[]>((resolve) => {
    setTimeout(() => {
      resolve(orders);
    }, 2000);
  });
}

export function getOrder(_: string, id: number) {
  return new Promise<Order | undefined>((resolve) => {
    setTimeout(() => {
      resolve(orders.find((o) => o.id === id));
    }, 1500);
  });
}
