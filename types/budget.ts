export type ExpenseType = {
  value: number;
  category: string;
  id?: any;
};

export interface BudgetInterface extends Document {
  month: string;
  budget?: number;
  expenses?: ExpenseType[];
  user?: any;
}
