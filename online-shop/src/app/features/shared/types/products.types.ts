export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  category: string;
  categoryDescription: string;
  imageUrl: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  weight: number;
  categoryId: string;
  imageUrl: string;
}
