
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  units_per_box?: number; // Campo movido para o nível de variação
}

export interface VariationPreset {
  id: string;
  name: string;
  variants: ProductVariant[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  isActive: boolean;
  variants: ProductVariant[];
  order_index?: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  productName: string;
  variantName: string;
  price: number;
}

export type AppView = 'catalog' | 'admin' | 'add-product' | 'edit-product' | 'login' | 'edit-categories' | 'edit-variations';
