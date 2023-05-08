export type ProductID = `product${number}`;

export type ProductRaw = {
  id: string;
  factory_id: string;
  date: string;
  [key: ProductID]: number;
};

export type Product = {
  id: number;
  factoryId: number;
  date: Date;
  [key: ProductID]: number;
};
