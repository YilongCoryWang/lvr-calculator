import { Router } from "express";
import { calcLVR } from "../../controller/lvrController";

const router = Router();
router.post("/lvr", calcLVR);

export default router;
