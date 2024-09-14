import { Router } from "express";
import { registerValidation, loginValidation } from "../helpers/inputValidator.js";
import validate from "../middlewares/validateMiddleware.js";
import FileManager from "../config/multer.config.js";
import { isloginController, logincontroller, registerController } from "../controllers/authController.js";

// Create the router
const router = Router();

// Register route with validation
router.post("/register", FileManager.single('file'), registerValidation, validate("Register"), registerController);

// Login route with validation
router.post("/login", loginValidation, validate("Login"), logincontroller);

// Checking Login router with validation
router.get("/islogin", isloginController);

export default router;
