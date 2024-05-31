import { Schema, model } from "mongoose"

const ContactSchema = new Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true },
        phoneNumber: { type: String, require: true },
        subject: { type: String, require: true },
        message: { type: String, require: true }
    },
    { timestamps: true }
)

const Contact = model("Contact", ContactSchema)
export default Contact