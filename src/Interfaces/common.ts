export interface CustomTheme {
  colors?: {
    custom?: {};
  };
}

export type Bill = {
  id: string;
  name: string;
  price: number;
  unit: string;
  unitPrice: number;
  quantity: number;
  fromDate?: number;
  toDate?: number;
  guest?: {
    id: string;
    name: string;
  };
  room?: {
    id: string;
    name: string;
  };
};
