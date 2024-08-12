
import { Bill } from "../Interfaces/common";

export interface GuestBill {
  billDetails: Bill[];
  fromDate?: number;
  toDate?: number;
  guest: string;
  room: string;
  total?: number;
}
