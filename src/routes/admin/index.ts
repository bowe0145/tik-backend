import express from "express";
import { FetchAllUsers } from "./get";

const router = express.Router();

router.get("/", FetchAllUsers);

export default router;
