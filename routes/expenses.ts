import { Request, Response, Router } from "express";
import verify from "../middleware/verifyUser";
import Budget from "../models/Budget";
const router: Router = Router();

router.post("/expenses", verify, async (req: Request, res: Response) => {
  console.log(req.body, "body");
  const foundExpenses = await Budget.find({
    user: req.user,
    month: req.body.month,
  });

  if (foundExpenses.length > 0) {
    try {
      await Budget.updateOne(
        { user: req.user, month: req.body.month },
        {
          $push: {
            expenses: {
              value: req.body.value,
              category: req.body.category,
              id: req.body.id,
            },
          },
        }
      );

      res.status(200).json({
        success: true,
        data: {
          value: req.body.value,
          category: req.body.category,
          id: req.body.id,
        },
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err });
    }
  } else {
    res.status(400).json({
      success: false,
      error: "You must have a budget to enter an expense.",
    });
  }
});

router.post("/expenses/delete", verify, async (req: Request, res: Response) => {
  const foundExpenses = await Budget.findOne({
    user: req.user,
    month: req.body.month,
  });

  if (foundExpenses) {
    try {
      const updated = await Budget.updateOne(
        {
          user: req.user,
          month: req.body.month,
        },
        {
          $pull: { expenses: { id: req.body.id } },
        }
      );

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (err) {
      console.log(err);
    }
  }
});

router.post(
  "/expenses/delete/deleteAll",
  verify,
  async (req: Request, res: Response) => {
    const foundExpenses = await Budget.findOne({
      user: req.user,
      month: req.body.month,
    });

    if (foundExpenses) {
      try {
        const removeAllExpenses = await Budget.updateOne(
          {
            user: req.user,
            month: req.body.month,
          },
          { $set: { expenses: [] } }
        );

        res.status(200).json({ success: true, data: removeAllExpenses });
      } catch (err) {}
      // res.status(200).json({ success: true, data: foundExpenses });
    }
  }
);

module.exports = router;
