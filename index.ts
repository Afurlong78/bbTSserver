import express, { Express, Request, Response } from "express";
const app: Express = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors({ origin: "*", credentials: true  }));

//import routes
const authRoute = require("./routes/auth");
const budgetRoute = require("./routes/budgets");
const expenseRoute = require("./routes/expenses");
const confirmUser = require("./routes/userConfirmation");
const monthRoute = require("./routes/month");
const forgotPassword = require("./routes/forgotPassword");
const updatePassword = require("./routes/updatePassword");

//importing dotenv
dotenv.config();

//connecting to DB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("Connected to database.")
);

app.get("/api", (req: Request, res: Response) => {
  res.send("hello from the server.");
});

//middleware for server
app.use(express.json());

//use routes
app.use("/api/user", authRoute);
app.use("/api/posts", budgetRoute);
app.use("/api/posts", expenseRoute);
app.use("/api/confirmUser", confirmUser);
app.use("/api/posts", monthRoute);
app.use("/api/posts", forgotPassword);
app.use("/api/posts", updatePassword);

let port = process.env.PORT || 5000;
app.listen(port, () => console.log("Express server is running."));
