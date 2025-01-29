import { Request, Response } from "express";

export const calcLVR = (req: Request, res: Response) => {
  const { estLoanValue, cashOutAmt, propertyValue } = req.body;

  if (propertyValue > 0) {
    const lvr = Math.round(
      ((parseInt(estLoanValue) + cashOutAmt) * 100) / propertyValue
    );
    res.json({ lvr });
  } else {
    res.status(400).json({ message: "Property value invalid" });
  }
};
