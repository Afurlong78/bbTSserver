import { Request, Response, Router } from "express";
import verify from "../middleware/verifyUser";
import Budget from "../models/Budget";

const router: Router = Router();

router.get("/month", verify, async (req: Request, res: Response) => {
  const foundBudgets = await Budget.find({ user: req.user });

  if (foundBudgets) {
    res.status(200).json({ success: true, data: foundBudgets });
  } else {
    res.status(200).json({ success: true, data: [] });
  }
});

module.exports = router;
