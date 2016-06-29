import * as mongoose from "mongoose";
let Schema = mongoose.Schema;

export let serviceSchema = new Schema({
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

serviceSchema.set('toJSON', {
    virtuals: true,
	transform: function(doc:any, ret:any, options:any){
        delete ret.id;
		delete ret.__v;
	}
});