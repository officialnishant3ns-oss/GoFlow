import mongoose from "mongoose"
import bcrypt from 'bcrypt'
const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'password is requred']
    },
    profileimage: {
        type: String,
        required: true
    },
    refresstoken: {
        type: String
    },
    otp: {
        type: String
    },
    otpexpiry: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

userschema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userschema.methods.ispassword = async (req, res) => {
    return await bcrypt.compare(password, this.password)
}
userschema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userschema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

const User = mongoose.model('User', userschema)
export default User