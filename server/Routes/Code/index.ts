import express from "express";
import Code from "../../Controllers/Code";

const router = express.Router();

router.post("/execute", Code.execute);
router.get("/runtimes", Code.runtimes);

export default router;
