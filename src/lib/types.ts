export type ArtKind =
  | "dress"
  | "blouse"
  | "pants"
  | "skirt"
  | "blazer"
  | "bag"
  | "heels"
  | "jumpsuit"
  | "knit"
  | "coat"
  | "necklace"
  | "swim";

export type StockStatus = "disponivel" | "esgotado" | "indisponivel";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // slug da categoria
  subcategory: string; // slug da subcategoria
  brand: string; // slug da marca
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  colors: ProductColor[];
  sizes: string[];
  stock: StockStatus;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
  details: string[];
  composition: string;
  care: string[];
  art: ArtKind;
  tone: number; // 0..3 variação de fundo da ilustração
  /** URLs de fotos reais. Quando vazio, a ilustração editorial é exibida. */
  images?: string[];
  sold: number;
  createdAt: string;
}

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  art: ArtKind;
  subcategories: Subcategory[];
}

export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  origin: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  size: string;
  fit: "pequeno" | "perfeito" | "grande";
  verified: boolean;
  helpful: number;
}

export interface Question {
  id: string;
  productId: string;
  author: string;
  question: string;
  answer?: string;
  date: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  minValue: number;
  expiresAt: string;
  status?: "ativo" | "usado" | "expirado";
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  zip: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  phone: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | "aguardando"
  | "aprovado"
  | "preparacao"
  | "enviado"
  | "transporte"
  | "entregue"
  | "atrasado"
  | "cancelado";

export interface OrderItem {
  productId: string;
  size: string;
  color: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: number;
  discount: number;
  payment: "pix" | "cartao" | "boleto";
  addressId: string;
  carrier: string;
  tracking: string;
  estimated: string;
}

export interface CartItem {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
}

export interface BlogAuthor {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  art: ArtKind;
  tone: number;
  body: { type: "p" | "h2" | "quote" | "list"; text: string | string[] }[];
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  days: string;
  price: number;
}
