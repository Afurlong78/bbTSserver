import { Request, Response, Router } from "express";
import User from "../models/User";
const jwt = require("jsonwebtoken");
const router: Router = Router();

router.get("/confirmation/:token", async (req: Request, res: Response) => {
  const verified = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
  try {
    const foundUser = await User.findOne({ _id: verified.user });

    const confirmedUser = await User.updateOne(
      { _id: foundUser?._id },
      { $set: { activatedUser: true } }
    );
    res.redirect("http://localhost:3000/login");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
