"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
exports.partnerSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    partnerName: String
});
exports.partnerSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.id;
        delete ret.__v;
    }
});
//# sourceMappingURL=partners.js.map