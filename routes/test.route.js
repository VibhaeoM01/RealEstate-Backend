import express from "express"
import { shouldbeAdmin, shouldbeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verfiyToken.js";

const router=express.Router();
router.get("/should-be-loggedin",verifyToken,shouldbeLoggedIn);
router.get("/should-be-admin",shouldbeAdmin);
export default router;