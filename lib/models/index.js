"use strict";
const mongoose = require("mongoose");
const users_1 = require("./users");
const brands_1 = require("./brands");
const categories_1 = require("./categories");
const partners_1 = require("./partners");
const services_1 = require("./services");
exports.models = {
    Users: users_1.usersModel,
    Brands: mongoose.model('Brand', brands_1.brandSchema),
    Categories: mongoose.model('Category', categories_1.categorySchema),
    Partners: mongoose.model('Partner', partners_1.partnerSchema),
    Services: mongoose.model('Service', services_1.serviceSchema),
};
//# sourceMappingURL=index.js.map