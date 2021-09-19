"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var express_1 = __importStar(require("express"));
var express_session_1 = __importDefault(require("express-session"));
//@ts-ignore
var serverless_http_1 = __importDefault(require("serverless-http"));
var chemical_controller_1 = require("./controllers/chemical.controller");
var port = 3000;
var app = (0, express_1.default)();
var router = (0, express_1.Router)();
app.use((0, express_session_1.default)({ secret: "chemistry", cookie: { maxAge: 60000, httpOnly: false } }));
app.set("view engine", "pug");
app.set("views", "./src/pages");
router.get("/", function (req, res) {
    res.send("test");
});
router.get("/safety", function (req, res) {
    if (!req.session.info) {
        res.redirect("/");
        return;
    }
    res.render("safety", req.session.info);
});
router.use("/api", chemical_controller_1.chemicalController);
app.use("/.netlify/functions/chemical", router);
var handler = (0, serverless_http_1.default)(app);
exports.handler = handler;
//TODO: remove session
//TODO: style index page
