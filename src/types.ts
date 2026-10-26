export type Category = "clothing" | "shoes" | "bags" | "jewelry" | "accessories";
export type ArtKind =
  | "dress" | "blouse" | "skirt" | "coat"
  | "heels" | "flats" | "boots"
  | "tote" | "handbag" | "clutch"
  | "earrings" | "necklace" | "ring" | "bracelet"
  | "scarf" | "hat" | "sunglasses";

export interface Color { name: string; hex: string }

export interface Product {
  id: string;
  name: string;
  category: Category;
  kind: ArtKind;
  price: number;
  compareAt?: number;
  stock: number;
  colors: Color[];
  sizes: string[];
  images: string[];
  description: string;
  material: string;
  tags: string[];
  isNew: boolean;
  isBest: boolean;
  status: "active" | "draft" | "archived";
  sold: number;
  createdAt: string;
}

export type PostColumn = "Styling Tips" | "Trend Report" | "Capsule Wardrobe" | "Occasion Wear" | "Care Guide";

export interface Post {
  id: string;
  type: "article" | "video";
  title: string;
  column: PostColumn;
  excerpt: string;
  body: string;
  cover?: string;
  palette: [string, string];
  art: ArtKind;
  productIds: string[];
  videoUrl?: string;
  duration?: string;
  status: "published" | "draft";
  publishedAt: string;
  author: string;
  views: number;
}

export interface CartItem { productId: string; qty: number; color: string; size: string }

export interface OrderItem { productId: string; name: string; price: number; qty: number; color: string; size: string }

export type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "refunded";

export interface Order {
  id: string;
  email: string;
  name: string;
  address: { line1: string; city: string; zip: string; country: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  payment: "card" | "paypal" | "applepay";
  shippingMethod: "standard" | "express";
  status: OrderStatus;
  carrier?: string;
  tracking?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  country: string;
  subscribed: boolean;
  joinedAt: string;
}

export interface Look { id: string; title: string; subtitle: string; palette: [string, string]; productIds: string[] }

export interface Settings {
  storeName: string;
  announcement: string;
  freeShipThreshold: number;
  standardShip: number;
  expressShip: number;
  payments: { card: boolean; paypal: boolean; applepay: boolean };
  coupons: { code: string; percent: number }[];
  heroTitle: string;
  heroSubtitle: string;
  look: Look;
}

export interface State {
  products: Product[];
  posts: Post[];
  orders: Order[];
  customers: Customer[];
  settings: Settings;
  cart: CartItem[];
  wishlist: string[];
  user: { name: string; email: string } | null;
  admin: boolean;
}
