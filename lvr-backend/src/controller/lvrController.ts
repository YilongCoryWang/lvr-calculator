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
  let estLoanValue, cashOutAmt, estPropValue, propValuePhy, evidenceFile;
  if (req.method === "GET") {
    estLoanValue = req.query.estLoanValue;
    cashOutAmt = req.query.cashOutAmt;
    estPropValue = req.query.estPropValue;
    propValuePhy = req.query.propValuePhy;
  } else if (req.method === "POST") {
    estLoanValue = req.body.estLoanValue;
    cashOutAmt = req.body.cashOutAmt;
    estPropValue = req.body.estPropValue;
    propValuePhy = req.body.propValuePhy;
    evidenceFile = req.body.evidence;
  }

  console.log(req.query, req.method, req.body);

  if (propValuePhy) {
    if (parseInt(propValuePhy as string) < 0) {
      res
        .status(400)
        .json({ message: "Property value (physical) invalid:" + propValuePhy });
      return;
    } else if (!evidenceFile && req.method === "POST") {
      res
        .status(400)
        .json({ message: "Property value (physical) evidence is missing" });
      return;
    }
  }

  if (
    !estPropValue ||
    parseInt(estPropValue as string) < MIN_PROPERTY_VALUE ||
    parseInt(estPropValue as string) > MAX_PROPERTY_VALUE
  ) {
    res
      .status(400)
      .json({ message: "Estimated property value invalid:" + estPropValue });
    return;
  }

  if (
    !estLoanValue ||
    parseInt(estLoanValue as string) < MIN_LOAN ||
    parseInt(estLoanValue as string) > MAX_LOAN
  ) {
    res
      .status(400)
      .json({ message: "Estimated loan value invalid:" + estLoanValue });
    return;
  }

  if (cashOutAmt && parseInt(cashOutAmt as string) < 0) {
    res.status(400).json({ message: "Cash out value invalid:" + cashOutAmt });
    return;
  }
  next();
};

export const calcLVR = (req: Request, res: Response) => {
  const { estLoanValue, cashOutAmt, estPropValue, propValuePhy } = req.query;
  const estLoan = parseInt(estLoanValue as string);
  const cashOut = (function () {
    if (cashOutAmt) {
      return parseInt(cashOutAmt as string);
    }
    return 0;
  })();
  const propertyVal = (function () {
    if (propValuePhy) {
      return parseInt(propValuePhy as string);
    }
    return parseInt(estPropValue as string);
  })();
  const lvr = Math.round(((estLoan + cashOut) * 100) / propertyVal);
  res.json({ lvr });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/property-value-evidence");
  },
  filename: function (req, file, cb) {
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
  if (file.mimetype.startsWith("application")) cb(null, true);
  else cb(new Error("Only document types are allowed"));
}

const upload = multer({ storage, fileFilter });
export const uploadPropertyValueEvidence = upload.single("evidence");

export const createLVR = (req: Request, res: Response) => {
  console.log("Create and store LVR with data:", req.body);
  res.json({ message: "LVR created" });
};
