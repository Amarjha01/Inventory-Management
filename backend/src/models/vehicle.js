import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
    {

        vehicleNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        vehicleName: {
            type: String,
            required: true,
            trim: true
        },
        tracker:{
            provider:String,
            envKey:String,
            isActive:Boolean,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        },

        capacity: {
            type: Number,
            default: 0
        },

        remarks: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;