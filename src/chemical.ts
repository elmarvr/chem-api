//@ts-ignore
import { Handler } from "@netlify/functions";
import express, { Router } from "express";
import session from "express-session";
import serverless from "serverless-http";
import { chemicalController } from "./controllers/chemical.controller";

const port = 3000;

const app = express();
const router = Router();

app.use(
  session({ secret: "chemistry", cookie: { maxAge: 60000, httpOnly: false } })
);

app.set("view engine", "pug");
app.set("views", "./src/pages");

router.get("/", (req, res) => {
  res.send("test");
});

router.get("/safety", (req, res) => {
  if (!req.session.info) {
    res.redirect("/");
    return;
  }
  res.render("safety", req.session.info);
});

router.use("/api", chemicalController);

app.use("/.netlify/functions/chemical", router);

const handler = serverless(app);

export { handler };

//TODO: remove session
//TODO: style index page
