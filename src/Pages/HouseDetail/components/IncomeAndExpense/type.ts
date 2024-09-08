export interface IncomeAndExpenseColumn {
  id: string;
  label?: string;
  shouldDisplay: boolean;
  children?: {
    id: string;
    label: string;
  }[];
}

export interface MonthData {
  income: number;
  expense: number;
}

export const initvalueDefault = Object.freeze({
  content: "",
  january: {
    income: 0,
    expense: 0,
  },
  february: {
    income: 0,
    expense: 0,
  },
  march: {
    income: 0,
    expense: 0,
  },
  april: {
    income: 0,
    expense: 0,
  },
  may: {
    income: 0,
    expense: 0,
  },
  june: {
    income: 0,
    expense: 0,
  },
  july: {
    income: 0,
    expense: 0,
  },
  august: {
    income: 0,
    expense: 0,
  },
  september: {
    income: 0,
    expense: 0,
  },
  october: {
    income: 0,
    expense: 0,
  },
  november: {
    income: 0,
    expense: 0,
  },
  december: {
    income: 0,
    expense: 0,
  },
});
