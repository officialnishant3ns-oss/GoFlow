import asynchandler from '../utils/asynchandler.js'
import apierror from '../utils/apierror.js'
import apiresponse from '../utils/apiresponse.js'
import uploadonclodinary from '../utils/cloudinary.js'
import sendOtpEmail from '../config/email_otp.js'

import User from '../models/user.models.js'



const accessandrefreshtokengenerate = async (userId) => {
    try {
        const user = await User.findOne(userId)
        const refreshtoken = await user.generateRefreshToken()
        const accesstoken = await user.generateAccessToken()

        user.refresstoken = refreshtoken
        await user.save({ validateBeforeSave: true })
        return { accesstoken, refreshtoken }
    } catch (error) {
        throw new apierror(500, "something went wrong while generating user")
    }
}
const register = asynchandler(async (req, res) => {
    const { username, email, fullname, password } = req.body
    if ([username, email, fullname, password].some((field) =>
        field?.trim() === ""
    )) {
        throw new apierror(400, "Something is Missing from [username, email, fullname, password] ")
    }
    const profileimagePath = await req.files?.profileimage[0]?.path
    console.log(profileimagePath)
    if (!profileimagePath) {
        throw new apierror(400, "Profile image URL is missing ")
    }
    const profileimage = await uploadonclodinary(profileimagePath)
    if (!profileimage) {
        throw new apierror(400, "Profileimage is required.. ")
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpexpiry = new Date(Date.now() + 5 * 60 * 1000)
    console.log(otp, otpexpiry)


    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        profileimage: profileimage.url,
        otp,
        otpexpiry,
        isVerified: false
    })

    await sendOtpEmail(user.email, otp)

    const createduser = await User.findById(user._id).select(
        "-password -refresstoken -otp -otpexpiry"
    )
    if (!createduser) {
        throw new apierror(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiresponse(200, createduser, "User registered successfully")
    )
})

const verifyotp = asynchandler(async (req, res) => {
    const { email, otp } = req.body

    if (!email || !otp) {
        throw new apierror(400, "Something is mising from email or otp")
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new apierror(404, "User not found")
    }
    if (user.otpexpiry && user.otpexpiry < Date.now()) {
        throw new apierror(400, "Your otp is Expired")
    }
    if (user.otp !== otp) {
        throw new apierror(400, "YOur otp is Wrong")
    }
    user.isVerified = true
    user.otp = undefined
    user.otpexpiry = undefined

    await user.save()

    return res.status(200).json(
        new apiresponse(200, { success: true }, "User verified successfully")
    );

})
const login = asynchandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        throw new apierror(404, "User not found")
    }

    const validpassword = await user.isPassword(password)
    if (!validpassword) {
        throw new apierror(401, "Password not correct there")
    }
    const { refreshtoken, accesstoken } = await accessandrefreshtokengenerate(user._id)

    const loggegInUser = await User.findById(user._id).select(
        "-password -refresstoken"
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new apiresponse(
                200,
                { user: loggegInUser, accesstoken, refreshtoken },
                "login successfull")
        )
})
const logout = asynchandler(async (req, res) => {
    User.findByIdAndUpdate(req.user_id,
        {
            $set: { refresstoken: undefined }
        },
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accesstoken", option)
        .clearCookie("refreshtoken", option).json(
            new apiresponse(200, {}, "User logged out")
        )
})
const updatePassword = asynchandler(async (req, res) => {
    const { newpassword, oldpassword } = req.body
    if (!newpassword || !oldpassword) {
        throw new apierror(404, "Something is missing")
    }

    const user = await User.findOne(req.user?._id)

    const isPasswordcorrect = user.isPassword(oldpassword)
    if (!isPasswordcorrect) {
        throw new apierror(400, "invalid old password")
    }

    user.password = newpassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new apiresponse(200, {}, "password change successfuly")
    )


})

const getcurrentUser = asynchandler(async (req, res) => {
    const user = req.user
    return res.status(200).json(
        200, "current user is fetched successfully", user
    )
})
const updateprofolepicture = asynchandler(async (req, res) => {
    const profileimage = req.file?.path
    if (!profileimage) {
        throw new apierror(400, "profileimage files is missing")
    }

    const profilephoto = await uploadonclodinary(profileimage)
    if (!profilephoto.url) {
        throw new apierror(400, "Error while uploading ")
    }

    const user =await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                profileimage: profilephoto.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(
        new apiresponse(200, "profileimage updated successfully", user)
    )
}
)
export { register, verifyotp, login, logout, updatePassword, getcurrentUser, updateprofolepicture }