import { Codes } from "./code.interface";

export interface ChemicalInfo {
  name: string;
  cas_number: string;
  codes: Codes;
  pictograms: string[];
}
