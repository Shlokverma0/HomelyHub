//Address list
import express from "express";
import {signup, login} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

export {router}