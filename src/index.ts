//@ts-ignore
import express from "express";
import session from "express-session";
import serverless from "serverless-http";
import { chemicalController } from "./controllers/chemical.controller";

const port = 3000;

const app = express();

app.use(
  session({ secret: "chemistry", cookie: { maxAge: 60000, httpOnly: false } })
);

app.set("view engine", "pug");
app.set("views", "./src/pages");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/safety", (req, res) => {
  if (!req.session.info) {
    res.redirect("/");
    return;
  }
  res.render("safety", req.session.info);
});

app.use("/.netlify/functions/server", chemicalController);

const handler = serverless(app);

export { handler };

//TODO: remove session
//TODO: style index page
