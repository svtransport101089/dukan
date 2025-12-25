
import { Product, StoreSettings } from './types';

export const BUSINESS_DETAILS = {
  ownerMobile: "9499900625",
  upiId: "parthi101089-1@okaxis",
  location: "Tambaram, Chennai, Tamil Nadu, India",
  currency: "₹",
  country: "India",
  storeName: "Parthi Store"
};

export const SAMPLE_PRODUCTS: Partial<Product>[] = [
  { name: "Tea Powder Sachet", price: 5, category: "Grocery", stock: 100, image: "https://picsum.photos/seed/tea/400/400" },
  { name: "Coffee Sachet", price: 5, category: "Grocery", stock: 100, image: "https://picsum.photos/seed/coffee/400/400" },
  { name: "Biscuit Pack (Small)", price: 10, category: "Snacks", stock: 50, image: "https://picsum.photos/seed/biscuit/400/400" },
  { name: "Chocolate (Mini)", price: 10, category: "Snacks", stock: 50, image: "https://picsum.photos/seed/choc/400/400" },
  { name: "Pen", price: 5, category: "Stationery", stock: 200, image: "https://picsum.photos/seed/pen/400/400" },
  { name: "Pencil", price: 2, category: "Stationery", stock: 200, image: "https://picsum.photos/seed/pencil/400/400" },
  { name: "Eraser", price: 1, category: "Stationery", stock: 200, image: "https://picsum.photos/seed/eraser/400/400" },
  { name: "Notebook (Mini)", price: 10, category: "Stationery", stock: 50, image: "https://picsum.photos/seed/notebook/400/400" },
  { name: "Match Box", price: 2, category: "Daily Needs", stock: 100, image: "https://picsum.photos/seed/match/400/400" },
  { name: "Plastic Cover", price: 1, category: "Daily Needs", stock: 300, image: "https://picsum.photos/seed/cover/400/400" },
];

export const DUKAAN_BLUE = "#146eb4";
