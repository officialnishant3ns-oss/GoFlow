import asynchandler from '../utils/asynchandler'
import apierror from '../utils/apierror.js'
import apiresponse from '../utils/apiresponse.js'
//import cloudinary
import User from './models/user.models'
import sendOtpEmail from '../utils/email_otp.js'

const register = asynchandler(async (req, res) => {
    const { username, email, fullname, password } = req.body
    if ([username, email, fullname, password].some((field) =>
        field?.trim() === ""
    )) {
        throw new apierror(400, "Something is Missing from [username, email, fullname, password] ")
    }
    const profileimagePath = await req.files?.profileimage[0]?.path
    if (!profileimagePath) {
        throw new apierror(400, "Profile image URL is missing ")
    }
    const profileimage = await uploadonclodinary(profileimagePath)
    if (!profileimage) {
        throw new apierror(400, "Avatar is required.. ")
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpexpiry = new Date(Date.now() + 5 * 60 * 1000)
    console.log(otp, otpexpiry)


    const user = await User.create({
        fullname,
        profileimage: profileimage.url,
        email,
        password,
        username: username.toLowerCase(),
        isVerified: false
    })

    await sendOtpEmail(user.email, otp)

    const createduser = await User.findById(user._id).select(
        "-password -refresstoken"
    )
    if (!createduser) {
        throw new apierror(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiresponse(200, createduser, "User registered successfully")
    )
})

export { register }