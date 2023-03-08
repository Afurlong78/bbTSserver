import { Request, Response, Router } from "express";
import verify from "../middleware/verifyUser";
import Budget from "../models/Budget";
const router: Router = Router();

router.get("/budget", (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: "hello from budgets" });
});

router.get(
  "/budgets/budgetsOnLoad",
  verify,
  async (req: Request, res: Response) => {
    const foundBudget = await Budget.find({
      user: req.user,
    });

    if (!foundBudget || foundBudget.length === 0) {
      res.status(200).json({
        success: true,
        data: { budget: 0, month: "January", expenses: [] },
      });
    } else if (foundBudget.length > 1) {
      const lastBudget = foundBudget.splice(foundBudget.length - 1);

      res.status(200).json({
        success: true,
        data: {
          budget: lastBudget[0].budget,
          month: lastBudget[0].month,
          expenses: lastBudget[0].expenses,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          budget: foundBudget[0].budget,
          month: foundBudget[0].month,
          expenses: foundBudget[0].expenses,
        },
      });
    }
  }
);

router.get("/budgets/getMonth", verify, async (req: Request, res: Response) => {
  const foundBudget = await Budget.findOne({
    user: req.user,
    month: req.headers.month,
  });

  if (foundBudget) {
    res.status(200).json({
      success: true,
      data: {
        budget: foundBudget.budget,
        month: foundBudget.month,
        expenses: foundBudget.expenses,
      },
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Blank Response Budget",
      data: {
        budget: 0,
        month: req.headers.month,
        expenses: [],
      },
    });
  }
});

router.post("/budgets", verify, async (req: Request, res: Response) => {
  const foundBudget = await Budget.findOne({
    month: req.body.month,
    user: req.user,
  });

  if (foundBudget) {
    try {
      await Budget.updateOne(
        { month: foundBudget.month },
        { $set: { budget: req.body.budget } }
      );
      res.status(200).json({
        success: true,
        data: {
          budget: req.body.budget,
          month: foundBudget.month,
          expenses: foundBudget.expenses,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  } else {
    const budget = new Budget({
      month: req.body.month,
      budget: req.body.budget,
      user: req.user,
    });

    try {
      const savedBudget = await budget.save();
      res.status(200).json({
        success: true,
        data: {
          budget: savedBudget.budget,
          month: savedBudget.month,
          expenses: savedBudget.expenses,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
});

module.exports = router;
