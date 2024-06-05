import express from "express";
import Auth from "../../Controllers/Auth";
import AuthValidator from "../../Validators/Auth";

const router = express.Router();

router.post("/register", AuthValidator.signupValidator, Auth.signup);
router.post("/login", Auth.login);

router.get("/user", Auth.verifytoken as any, Auth.getuser as any);

router.get("/refresh", Auth.verifyRefreshToken as any, Auth.refresh as any);

router.post("/logout", Auth.logout as any);

router.post(
	"/verify",
	Auth.verifytoken as any,
	AuthValidator.verification as any,
	AuthValidator.isOTP as any,
	Auth.verify as any
);
router.post(
	"/generate",
	Auth.verifytoken as any,
	AuthValidator.verification as any,
	Auth.generate as any
);

export default router;
