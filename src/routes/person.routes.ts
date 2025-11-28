import { Router } from "express";
import { PersonController } from "../controllers/person.controller";

const router = Router();

router.get("/", PersonController.get);
router.get("/:id", PersonController.getById);
router.post("/", PersonController.create);
router.put("/:id", PersonController.update);
router.delete("/:id", PersonController.remove);

export default router;
