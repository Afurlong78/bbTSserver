type ExpenseArray = {
  value: number;
  category: string;
  id?: any;
};

export interface ExpenseInterface extends Document {
  month: string;
  expenses: ExpenseArray[];
  id?: any;
}
