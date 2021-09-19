import { Router } from "express";
import { chemicalService } from "../services/chemical.service";

export const chemicalController = Router();

chemicalController.get("/:name", (req, res) => {
  const { name } = req.params;

  chemicalService.getInfo(name).subscribe({
    next: (data) => {
      req.session.info = data;

      res.status(200).send({
        status: 200,
        data,
      });
    },
    error: (error) =>
      res.status(400).send({
        status: 400,
        message: error,
      }),
  });
});
