"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chemicalController = void 0;
var express_1 = require("express");
var chemical_service_1 = require("../services/chemical.service");
exports.chemicalController = (0, express_1.Router)();
exports.chemicalController.get("/:name", function (req, res) {
    var name = req.params.name;
    chemical_service_1.chemicalService.getInfo(name).subscribe({
        next: function (data) {
            req.session.info = data;
            res.status(200).send({
                status: 200,
                data: data,
            });
        },
        error: function (error) {
            return res.status(400).send({
                status: 400,
                message: error,
            });
        },
    });
});
