import { Router } from "express";
import { calcLVR, checkParams } from "../../controller/lvrController";

const router = Router();
router.get("/lvr", checkParams, calcLVR);

export default router;
