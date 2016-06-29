"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
exports.serviceSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    category: String,
    rating: Number,
    color: String,
    address: String,
    openHours: {
        from: String,
        till: String
    },
    isOpen: Boolean,
    isDiscounted: Boolean,
    price: {
        min: {
            currency: String,
            value: Number
        }
    },
    length: Number,
    priceEffective: {
        startDate: Date,
        endDate: Date
    },
    priceIneffective: {
        startDate: Date,
        endDate: Date
    }
});
exports.serviceSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.id;
        delete ret.__v;
    }
});
//# sourceMappingURL=services.js.map