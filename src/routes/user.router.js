import { Router } from "express"
import upload from "../Middleware/multer.middleware.js"
import { getcurrentUser, login, logout, register, updatePassword, updateprofolepicture, verifyotp } from "../controllers/user.controller.js"
import verifyJWT from "../middleware/auth.middleware.js"
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
router.route('/updatepassword').put(verifyJWT,updatePassword)
router.route('/getuser').put(verifyJWT,getcurrentUser)
router.route("/updateprofilepicture").post(
    verifyJWT,
    upload.single("profileimage"),
    updateprofolepicture
)

export default router