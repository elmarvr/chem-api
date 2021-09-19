import parse, { HTMLElement } from "node-html-parser";
import { forkJoin, from, map, mergeMap, reduce, toArray } from "rxjs";
import { CasSearchResponse } from "../interfaces/cas-search-response.interface";
import { ChemicalInfo } from "../interfaces/chemical-info.interface";
import { Code, Codes } from "../interfaces/code.interface";
import { httpService } from "./http.service";

const searchCasNumber = (name: string) => {
  const baseUrl = "https://commonchemistry.cas.org/api";

  return httpService
    .get<CasSearchResponse>(`${baseUrl}/search`, {
      params: {
        q: name,
      },
    })
    .pipe(
      map(({ count, results }) => {
        if (count === 0) {
          throw "Chemical not found";
        }

        return results[0].rn;
      })
    );
};

const getPageUrl = (casNumber: string) => {
  return `https://www.guidechem.com/msds/${casNumber}.html`;
};

const getSafetyHtml = (casNumber: string) => {
  const pageUrl = getPageUrl(casNumber);

  return httpService.get<string>(pageUrl).pipe(
    map((html) => {
      const start = html.indexOf('<h3 class="title" id="section2"');
      const end = html.indexOf('<h3 class="title" id="section3"');

      return parse(html.substring(start, end));
    })
  );
};

const getPictograms = (casNumber: string) => {
  return getSafetyHtml(casNumber).pipe(
    mergeMap((html) => {
      return from([...html.querySelectorAll("img")]).pipe(
        map((el) => {
          return el.getAttribute("src")!;
        })
      );
    }),
    toArray()
  );
};

const extractCode = map(({ textContent }: HTMLElement) => {
  const label = textContent.match(/\+?(P|H)\d{3}/g)?.join("");

  if (label) {
    const content = textContent.replace(label, "").trim();

    return {
      label,
      content,
    } as Code;
  }
});

const groupCodes = reduce<Code | undefined, Codes>(
  (acc, code) => {
    if (code) {
      if (code.label.startsWith("H")) {
        acc.h.push(code);

        return acc;
      }

      acc.p.push(code);
    }

    return acc;
  },
  {
    p: [],
    h: [],
  }
);

const getCodes = (casNumber: string) => {
  return getSafetyHtml(casNumber).pipe(
    mergeMap((html) => {
      html;

      return from([...html.querySelectorAll("p")]).pipe(
        extractCode,
        groupCodes
      );
    })
  );
};

const getInfo = (name: string) => {
  return searchCasNumber(name).pipe(
    mergeMap((casNumber) => {
      return forkJoin({
        codes: getCodes(casNumber),
        pictograms: getPictograms(casNumber),
      }).pipe(
        map(
          (data) =>
            ({
              name,
              cas_number: casNumber,
              ...data,
            } as ChemicalInfo)
        )
      );
    })
  );
};

export const chemicalService = {
  getCodes,
  getPictograms,
  searchCasNumber,
  getInfo,
};
