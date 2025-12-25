
import { Product, Order, StoreSettings } from '../types';
import { SAMPLE_PRODUCTS, BUSINESS_DETAILS } from '../constants';

const KEY_PRODUCTS = 'parthi_store_products';
const KEY_ORDERS = 'parthi_store_orders';
const KEY_SETTINGS = 'parthi_store_settings';

export const db = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEY_PRODUCTS);
    if (!data) {
      const initial = SAMPLE_PRODUCTS.map((p, i) => ({
        ...p,
        id: `prod_${i}`,
        enabled: true,
      })) as Product[];
      localStorage.setItem(KEY_PRODUCTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  
  saveProduct: (product: Product) => {
    const products = db.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
  },

  deleteProduct: (id: string) => {
    const products = db.getProducts().filter(p => p.id !== id);
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem(KEY_ORDERS);
    return data ? JSON.parse(data) : [];
  },

  createOrder: (order: Order) => {
    const orders = db.getOrders();
    orders.unshift(order);
    localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    const orders = db.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders[index].status = status;
      localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
    }
  },

  getSettings: (): StoreSettings => {
    const data = localStorage.getItem(KEY_SETTINGS);
    if (!data) {
      const initial: StoreSettings = {
        name: BUSINESS_DETAILS.storeName,
        logo: "https://picsum.photos/seed/store/200/200",
        description: "Your local daily needs store",
        location: BUSINESS_DETAILS.location,
        contact: BUSINESS_DETAILS.ownerMobile,
        upiId: BUSINESS_DETAILS.upiId,
      };
      localStorage.setItem(KEY_SETTINGS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  updateSettings: (settings: StoreSettings) => {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  }
};
