import { Router } from "express";
import { getConferencePage } from "../controllers/conference";

const router = Router();

router.get("/", getConferencePage);

export default router;
