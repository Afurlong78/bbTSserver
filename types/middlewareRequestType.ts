import { Request } from "express";

export interface VerifyRequestType extends Request {
  user?: any;
}
