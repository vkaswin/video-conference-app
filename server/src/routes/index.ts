import { Router } from "express";
import ConferenceRoutes from "./conference";

const router = Router();

router.use("/conference", ConferenceRoutes);

export default router;
