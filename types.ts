
export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  image: string;
  enabled: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerMobile: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Cancelled' | 'Pending Verification';
  createdAt: number;
}

export interface StoreSettings {
  name: string;
  logo: string;
  description: string;
  location: string;
  contact: string;
  upiId: string;
}

export interface CartItem extends Product {
  quantity: number;
}
