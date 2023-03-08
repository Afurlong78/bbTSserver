import { Request, Response, Router } from "express";
import User from "../models/User";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router: Router = Router();

router.post("/register", async (req: Request, res: Response) => {
  // res.status(200).json({ success: true, data: req.body });

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res
      .status(400)
      .json({ success: false, data: "Email already exists." });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();

    const emailToken = jwt.sign(
      {
        ["user"]: savedUser._id,
      },
      process.env.EMAIL_SECRET,
      { expiresIn: "1d" }
    );

    // const url = `https://bb-server-production.up.railway.app/api/user/confirmation/${emailToken}`;
    const url = `http://localhost:5000/api/confirmUser/confirmation/${emailToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.BB_EMAIL,
        pass: process.env.BB_PASSWORD,
      },
    });

    const mailOptions = {
      from: "BetterBudgetRecovery@gmail.com",
      to: savedUser.email,
      subject: `Confirm Account Creation`,
      html: `Please click this link to confirm your email: <a href="${url}">Click.</a>`,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        // console.log(error);
        res.status(400).json({ success: false, data: error });
      } else {
        // console.log("email sent:" + info.response);
        res
          .status(200)
          .json({ success: true, user: savedUser, data: info.response });
      }
    });

    res.status(200).json({ success: true, user: savedUser });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Email is not found." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ success: false, message: "Password is not found." });

  const activatedUser = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!activatedUser?.activatedUser)
    return res
      .status(400)
      .json({ success: false, data: "please confirm account creation." });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res
    .header("Authorization", token)
    .status(200)
    .json({ success: true, token, id: user._id });
});

module.exports = router;
