import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import oresRouter from "./ores.js";
import cardsRouter from "./cards.js";
import forgeRouter from "./forge.js";
import statsRouter from "./stats.js";
import refineRouter from "./refine.js";
import summarizeRouter from "./summarize.js";
import blockchainRouter from "./blockchain.js";
import medalsRouter from "./medals.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(oresRouter);
router.use(cardsRouter);
router.use(forgeRouter);
router.use(statsRouter);
router.use(refineRouter);
router.use(summarizeRouter);
router.use(blockchainRouter);
router.use(medalsRouter);

export default router;
