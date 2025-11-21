import { Router } from "express"
import upload from "../Middleware/multer.middleware.js"
import { register } from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "profileimage", maxCount: 1 }
       
    ]),
    register
)
export default router