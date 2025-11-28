import { Request, Response } from "express";
import { PersonService } from "../services/person.service";
import { PaginationParams } from "../models/PaginationParams";

export const PersonController = {
  async get(req: Request, res: Response) {
    try {
      const params: PaginationParams = {
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 5),
        name: req.query.name?.toString(),
        sortBy: (req.query.sortBy as "id" | "name") || "id",
        sortOrder: (req.query.sortOrder as "ASC" | "DESC") || "ASC",
      };

      const result = await PersonService.getPaginated(params);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      res.json(await PersonService.getById(Number(req.params.id)));
    } catch (e: any) {
      res.status(404).json({ error: e.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      res.status(201).json(await PersonService.create(req.body));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      res.json(await PersonService.update(Number(req.params.id), req.body));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      res.json(await PersonService.remove(Number(req.params.id)));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },
};
