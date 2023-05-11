export type Product = {
  id: number;
  factoryId: number;
  date: Date;
  products: Array<{
    id: string;
    value: number;
  }>;
};

export type ProductsResponse = {
  products: Product[];
}