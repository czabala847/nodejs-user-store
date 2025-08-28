import mongoose, { Schema } from "mongoose"

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret){
    delete ret._id;
  },
});

export const ProductModel = mongoose.model("Product", productSchema);
