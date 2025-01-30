import { Router } from "express";
import {
  calcLVR,
  checkParams,
  createLVR,
  uploadPropertyValueEvidence,
} from "../../controller/lvrController";

/**
 * @openapi
 * /lvr:
 *   get:
 *     description: get loan to value ratio
 *     parameters:
 *       - name: estPropValue
 *         description: estimated property value
 *         in: query
 *         required: true
 *         type: string
 *       - name: estLoanValue
 *         description: estimated loan value
 *         in: query
 *         required: true
 *         type: string
 *       - name: cashOutAmt
 *         description: cash out amount
 *         in: query
 *         required: false
 *         type: string
 *       - name: propValuePhy
 *         description: property value (physical)
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: success and return lvr
 *   post:
 *     description: create loan to value ratio and upload document of property value (physical) evidence
 *     parameters:
 *       - name: estPropValue
 *         description: estimated property value
 *         in: body
 *         required: true
 *         type: string
 *       - name: estLoanValue
 *         description: estimated loan value
 *         in: body
 *         required: true
 *         type: string
 *       - name: cashOutAmt
 *         description: cash out amount
 *         in: body
 *         required: false
 *         type: string
 *       - name: propValuePhy
 *         description: property value (physical)
 *         in: body
 *         required: false
 *         type: string
 *       - name: evidence
 *         description: document of property value (physical) evidence
 *         in: body
 *         required: false (true if propValuePhy exists)
 *         type: file
 *     responses:
 *       200:
 *         description: success and return lvr
 */
const router = Router();
router
  .route("/lvr")
  .get(checkParams, calcLVR)
  .post(uploadPropertyValueEvidence, checkParams, createLVR);

export default router;
