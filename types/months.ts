export interface MonthsInterface extends Document {
  month: string;
  budget?: number;
  expenses?: number;
  user?: any;
}
