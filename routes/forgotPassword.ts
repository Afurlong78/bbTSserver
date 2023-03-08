import { Request, Response, Router } from "express";
import { customAlphabet } from "nanoid";
import User from "../models/User";
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router: Router = Router();

router.get("/generatePassword", async (req: Request, res: Response) => {
  console.log(req.body, "req body");

  const newPassword = customAlphabet("1234567890abcdefghijk!", 10);
  const password = newPassword();

  res.status(200).json({ success: true, data: { password: password } });
});

router.post("/generatePassword", async (req: Request, res: Response) => {
  const user = req.body?.user.toLowerCase();
  const foundUser = await User.findOne({ email: user });

  if (foundUser) {
    const newPassword = customAlphabet("1234567890abcdefghijk!", 10);
    const password = newPassword();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await User.updateOne(
        { email: foundUser.email },
        { $set: { password: hashedPassword } }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.BB_EMAIL,
          pass: process.env.BB_PASSWORD,
        },
      });

      const mailOptions = {
        from: "BetterBudgetRecovery@gmail.com",
        to: foundUser.email,
        subject: `BetterBudget Password Reset`,
        html: `Your password has been reset. Your new password: ${password}.`,
      };

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          // console.log(error);
          res.status(400).json({ success: false, data: error });
        } else {
          // console.log("email sent:" + info.response);
          res
            .status(200)
            .json({ success: true, user: foundUser, data: info.response });
        }
      });

      res
        .status(200)
        .json({ success: true, data: { user: foundUser, password: password } });
    } catch (err) {
      res.status(200).json({ success: false, data: "User not updated." });
    }
  } else {
    res.status(400).json({ success: false, error: "User was not found" });
  }
});

module.exports = router;
