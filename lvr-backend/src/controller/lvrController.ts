import { NextFunction, Request, Response } from "express";
import {
  MIN_PROPERTY_VALUE,
  MAX_PROPERTY_VALUE,
  MIN_LOAN,
  MAX_LOAN,
} from "../utils/constants";

export const checkParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { estLoanValue, cashOutAmt, propertyValue } = req.query;

  if (
    !propertyValue ||
    parseInt(propertyValue as string) < MIN_PROPERTY_VALUE ||
    parseInt(propertyValue as string) > MAX_PROPERTY_VALUE
  ) {
    res.status(400).json({ message: "Property value invalid" });
    return;
  }

  if (
    !estLoanValue ||
    parseInt(estLoanValue as string) < MIN_LOAN ||
    parseInt(estLoanValue as string) > MAX_LOAN
  ) {
    res.status(400).json({ message: "Loan value invalid" });
    return;
  }

  if (cashOutAmt && parseInt(cashOutAmt as string) < 0) {
    res.status(400).json({ message: "Cash out value invalid" });
    return;
  }
  next();
};

export const calcLVR = (req: Request, res: Response) => {
  const { estLoanValue, cashOutAmt, propertyValue } = req.query;
  console.log(estLoanValue, cashOutAmt, propertyValue);
  const estLoan = parseInt(estLoanValue as string);
  const cashOut = parseInt(cashOutAmt as string);
  const propertyVal = parseInt(propertyValue as string);
  const lvr = Math.round(((estLoan + cashOut) * 100) / propertyVal);
  console.log(estLoan, cashOut, propertyVal, lvr);
  res.json({ lvr });
};
