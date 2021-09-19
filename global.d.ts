import express from "express";
import { ChemicalInfo } from "./src/interfaces/chemical-info.interface";

export declare module "express-session" {
  interface SessionData {
    info?: ChemicalInfo;
  }
}
