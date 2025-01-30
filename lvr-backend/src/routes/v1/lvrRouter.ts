import { Router } from "express";
import {
  calcLVR,
  checkParams,
  createLVR,
  uploadPropertyValueEvidence,
} from "../../controller/lvrController";

const router = Router();
router
  .route("/lvr")
  .get(checkParams, calcLVR)
  .post(uploadPropertyValueEvidence, checkParams, createLVR);

export default router;
