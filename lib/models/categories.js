"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
exports.categorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    categoryName: String
});
exports.categorySchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.id;
        delete ret.__v;
    }
});
//# sourceMappingURL=categories.js.map