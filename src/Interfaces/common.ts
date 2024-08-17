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
  quantity?: number;
  startMonthQuantity?: number;
  endMonthQuantity?: number;
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
  status?: "paid" | "unpaid";
  paidDate?: number;
  type: BillQuantityType;
};

export enum BillQuantityType {
  MONTH = "MONTH",
  START_END = "START_END",
}

export enum BillStatus {
  PAID = "paid",
  UNPAID = "unpaid",
}

export interface OptionCommon {
  value: string;
  label: string;
  _id?: string;
}
