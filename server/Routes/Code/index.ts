import express from "express";
import Code from "../../Controllers/Code";
import Auth, { customRequest } from "../../Controllers/Auth";

const router = express.Router();

router.post("/execute", Auth.verifytoken as any, Code.execute);
router.get("/runtimes", Auth.verifytoken as any, Code.runtimes);
router.get("/room", Auth.verifytoken as any, Code.getAllRooms as any); //getting all the rooms created by user - done
router.post("/room", Auth.verifytoken as any, Code.createRoom as any); //creating a new room - done
router.get("/room/:id", Auth.verifytoken as any, Code.checkRoom as any); //getting the room is valid or not - done
router.delete("/room/:id", Auth.verifytoken as any,Code.deleteRoom as any); //deleting the room
router.get("/room/:id/files", Auth.verifytoken as any); // getting all files in the room



export default router;
