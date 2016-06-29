import * as mongoose from "mongoose";
let Schema = mongoose.Schema;

export let userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    fullName: String,
    hash: String,
    isActive: Boolean,
    avatar: String,
    userName: String,
    isReported: Boolean
});

userSchema.set('toJSON', {
    virtuals: true,
	transform: function(doc:any, ret:any, options:any){
        delete ret.id;
		delete ret.__v;
	}
});

export let usersModel = mongoose.model('User', userSchema);