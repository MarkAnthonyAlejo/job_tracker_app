import express from "express";
import { registerUser, getUser, login } from "../Controller/userController.js";

const router = express.Router();

router.get("/:id", getUser);
router.post("/register", registerUser); //POST a.k.a creates new user
router.post("/login", login);

export default router;
