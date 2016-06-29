import * as mongoose from "mongoose";
let Schema = mongoose.Schema;

export let brandSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    brandName: String
});

brandSchema.set('toJSON', {
    virtuals: true,
	transform: function(doc:any, ret:any, options:any){
        delete ret.id;
		delete ret.__v;
	}
});