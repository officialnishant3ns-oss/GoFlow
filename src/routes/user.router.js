import { Router } from "express"
import upload from "../Middleware/multer.middleware.js"
import { login, logout, register, updatePassword, verifyotp } from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "profileimage", maxCount: 1 }

    ]),
    register
)
router.route('/verifyotp').post(verifyotp)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/updatepassword').put(updatePassword)


export default router