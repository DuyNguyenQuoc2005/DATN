import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            max: 100000000,
            validate: {
                validator: Number.isSafeInteger,
                message: "Giá món ăn phải là số nguyên hợp lệ"
            }
        },
        imageUrl: {
            type: String,
            trim: true,
            maxlength: 2048,
            default: ""
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;