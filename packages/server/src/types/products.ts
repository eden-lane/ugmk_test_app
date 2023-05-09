export type ProductID = `product${number}`;

export type ProductRaw = {
  id: string;
  factory_id: string;
  date: string;
  [key: ProductID]: string;
};

export type Product = {
  id: number;
  factoryId: number;
  date: Date;
  products: Array<{
    id: string;
    value: number;
  }>
};
