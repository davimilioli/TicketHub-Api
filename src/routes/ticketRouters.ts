import { Router } from "express";
import TicketController from "../controllers/ticketController";

const router = Router();

router.post('/', TicketController.create);
router.post('/log', TicketController.createLog);
router.get('/:id', TicketController.get);
router.get('/', TicketController.getAll);
router.delete('/:id', TicketController.delete);

export default router;