"use strict";
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
exports.userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    fullName: String,
    hash: String,
    isActive: Boolean,
    avatar: String,
    userName: String,
    isReported: Boolean
});
exports.userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.id;
        delete ret.__v;
    }
});
exports.usersModel = mongoose.model('User', exports.userSchema);
//# sourceMappingURL=users.js.map