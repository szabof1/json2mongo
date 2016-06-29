"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
exports.brandSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    brandName: String
});
exports.brandSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.id;
        delete ret.__v;
    }
});
//# sourceMappingURL=brands.js.map