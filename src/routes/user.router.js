import { Router } from "express"
import upload from "../Middleware/multer.middleware.js"
import { register, verifyotp } from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "profileimage", maxCount: 1 }

    ]),
    register
)
router.route('/verifyotp').post(verifyotp)



export default router