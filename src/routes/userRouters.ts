import { Router } from "express";
import UserController from "../controllers/userController";

const router = Router();

router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.get('/:id/detail', UserController.get);
router.get('/', UserController.getAll);
router.post('/auth', UserController.auth);
router.get('/fakeUsers', UserController.createUsersFake);


export default router;