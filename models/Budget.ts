import mongoose, { Schema, Document } from "mongoose";
import { BudgetInterface, ExpenseType } from "../types/budget";

const budgetSchema = new Schema({
  month: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  budget: {
    type: Number,
  },
  expenses: {
    type: [{ value: Number, category: String, id: String }],
  },
  user: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<BudgetInterface>("Budget", budgetSchema);
