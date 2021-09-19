"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpService = void 0;
var axios_1 = __importDefault(require("axios"));
var rxjs_1 = require("rxjs");
var get = function (url, config) {
    return (0, rxjs_1.from)(axios_1.default.get(url, config)).pipe((0, rxjs_1.map)(function (response) { return response.data; }));
};
exports.httpService = {
    get: get,
};
