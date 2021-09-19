"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chemicalService = void 0;
var node_html_parser_1 = __importDefault(require("node-html-parser"));
var rxjs_1 = require("rxjs");
var http_service_1 = require("./http.service");
var searchCasNumber = function (name) {
    var baseUrl = "https://commonchemistry.cas.org/api";
    return http_service_1.httpService
        .get(baseUrl + "/search", {
        params: {
            q: name,
        },
    })
        .pipe((0, rxjs_1.map)(function (_a) {
        var count = _a.count, results = _a.results;
        if (count === 0) {
            throw "Chemical not found";
        }
        return results[0].rn;
    }));
};
var getPageUrl = function (casNumber) {
    return "https://www.guidechem.com/msds/" + casNumber + ".html";
};
var getSafetyHtml = function (casNumber) {
    var pageUrl = getPageUrl(casNumber);
    return http_service_1.httpService.get(pageUrl).pipe((0, rxjs_1.map)(function (html) {
        var start = html.indexOf('<h3 class="title" id="section2"');
        var end = html.indexOf('<h3 class="title" id="section3"');
        return (0, node_html_parser_1.default)(html.substring(start, end));
    }));
};
var getPictograms = function (casNumber) {
    return getSafetyHtml(casNumber).pipe((0, rxjs_1.mergeMap)(function (html) {
        return (0, rxjs_1.from)(__spreadArray([], html.querySelectorAll("img"), true)).pipe((0, rxjs_1.map)(function (el) {
            return el.getAttribute("src");
        }));
    }), (0, rxjs_1.toArray)());
};
var extractCode = (0, rxjs_1.map)(function (_a) {
    var _b;
    var textContent = _a.textContent;
    var label = (_b = textContent.match(/\+?(P|H)\d{3}/g)) === null || _b === void 0 ? void 0 : _b.join("");
    if (label) {
        var content = textContent.replace(label, "").trim();
        return {
            label: label,
            content: content,
        };
    }
});
var groupCodes = (0, rxjs_1.reduce)(function (acc, code) {
    if (code) {
        if (code.label.startsWith("H")) {
            acc.h.push(code);
            return acc;
        }
        acc.p.push(code);
    }
    return acc;
}, {
    p: [],
    h: [],
});
var getCodes = function (casNumber) {
    return getSafetyHtml(casNumber).pipe((0, rxjs_1.mergeMap)(function (html) {
        html;
        return (0, rxjs_1.from)(__spreadArray([], html.querySelectorAll("p"), true)).pipe(extractCode, groupCodes);
    }));
};
var getInfo = function (name) {
    return searchCasNumber(name).pipe((0, rxjs_1.mergeMap)(function (casNumber) {
        return (0, rxjs_1.forkJoin)({
            codes: getCodes(casNumber),
            pictograms: getPictograms(casNumber),
        }).pipe((0, rxjs_1.map)(function (data) {
            return (__assign({ name: name, cas_number: casNumber }, data));
        }));
    }));
};
exports.chemicalService = {
    getCodes: getCodes,
    getPictograms: getPictograms,
    searchCasNumber: searchCasNumber,
    getInfo: getInfo,
};
