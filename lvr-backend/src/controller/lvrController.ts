import { Request, Response } from "express";

export const calcLVR = (req: Request, res: Response) => {
  const { estLoanValue, cashOutAmt, propertyValue } = req.body;

  const lvr = Math.round(
    ((parseInt(estLoanValue) + cashOutAmt) * 100) / propertyValue
  );

  res.json({ lvr });
};
