// import comp from "bcryptjs"
import bcrypt from 'bcryptjs'
import jsonWT from 'jsonwebtoken'
import { Schema, model } from "mongoose"

// const { hash } = pkg
// const { compare } = comp
const { sign } = jsonWT

const UserSchema = new Schema(
    {
        avatar: { type: String, default: "" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verificationCode: { type: String, required: false},
        admin: { type: Boolean, default: false }
    },
    { timestamps: true }
)

//Encrypt Password
UserSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        let password = this.password
        password = await bcrypt.hash(this.password, 10)
        return next()
    }
    return next()
})

//users get a token after successfully registering
UserSchema.methods.generateJWT = async function() {
    return await sign({ id: this._id }, process.env.JWT_TOKEN, {
        expiresIn: "30d"
    })
}

//compare password when users tries to login
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = model("User", UserSchema)
export default User