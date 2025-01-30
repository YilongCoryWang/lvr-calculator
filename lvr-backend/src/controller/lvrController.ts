import { NextFunction, Request, Response } from "express";
import multer from "multer";
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
  let estLoanValue, cashOutAmt, propertyValue;
  if (req.method === "GET") {
    estLoanValue = req.query;
    cashOutAmt = req.query;
    propertyValue = req.query;
  } else if (req.method === "POST") {
    estLoanValue = req.body;
    cashOutAmt = req.body;
    propertyValue = req.body;
  }

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/property-value-evidence");
  },
  filename: function (req, file, cb) {
    console.log("file", file);
    const extension = "." + file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  console.log(file);
  if (file.mimetype.startsWith("application")) cb(null, true);
  else cb(new Error("Only document types are allowed"));
}

const upload = multer({ storage, fileFilter });
export const uploadPropertyValueEvidence = upload.single("evidence");

export const createLVR = (req: Request, res: Response) => {
  res.json({ message: "LVR created" });
};
