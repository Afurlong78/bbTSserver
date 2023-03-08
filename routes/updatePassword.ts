import { Request, Response, Router } from "express";
import verify from "../middleware/verifyUser";
import User from "../models/User";
const bcrypt = require("bcrypt");
const router: Router = Router();

router.post("/updatePassword", verify, async (req: Request, res: Response) => {
  const foundUser = await User.findOne({ _id: req.user });

  if (foundUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.updateOne(
        { _id: foundUser._id },
        { $set: { password: hashedPassword } }
      );

      res.status(200).json({ success: true, password: req.body.password });
    } catch (err) {
      res.status(400).json({ success: false, error: err });
    }
  }
});

module.exports = router;
