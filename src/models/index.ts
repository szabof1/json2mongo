import * as mongoose from "mongoose";
import {userSchema, usersModel} from "./users";
import {brandSchema} from "./brands";
import {categorySchema} from "./categories";
import {partnerSchema} from "./partners";
import {serviceSchema} from "./services";

export let models = {
    Users: usersModel,
    Brands: mongoose.model('Brand', brandSchema),
    Categories: mongoose.model('Category', categorySchema),
    Partners: mongoose.model('Partner', partnerSchema),
    Services: mongoose.model('Service', serviceSchema),
};