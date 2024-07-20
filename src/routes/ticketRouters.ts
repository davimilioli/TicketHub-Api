import { Router } from "express";
import TicketController from "../controllers/ticketController";

const router = Router();

router.post('/', TicketController.create);

export default router;