import express from "express";
import Auth, { customRequest } from "../../Controllers/Auth";
import RoomValidator from "../../Validators/Code";
import VCS from "../../Controllers/VCS";

const router = express.Router();

router.post("/add/:id", Auth.verifytoken as any, RoomValidator.isValidRoom as any, VCS.add as any);
router.post("/commit/:id", Auth.verifytoken as any, RoomValidator.isValidRoom as any, VCS.commit as any);
router.get("/commits/:id", Auth.verifytoken as any, RoomValidator.isValidRoom as any, VCS.showLogs as any);
router.get("/commit/:id/:commitId", Auth.verifytoken as any, RoomValidator.isValidRoom as any, VCS.getCommit as any);




export default router;