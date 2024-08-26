import express from "express"
import { createUser, deleteAdmin, getCurrentUser, listUsers, loginAdmin, logoutUser, refreshToken, updateAdmin } from "../../controllers/users/user.controller"
import { validateSchema } from "../../validations/schema/validateSchema"
import { createUserValidation, validateLoginSchema } from "../../validations/schema/user.joi"
import { AuthenticateToken, isAdmin, isAuthenticated } from "../../middlewares/ensureLogin"
const UserRouter = express.Router()
UserRouter.get("/", AuthenticateToken, isAdmin(["admin"]), listUsers)
UserRouter.post("/create-admin" , validateSchema(createUserValidation), createUser)
UserRouter.post("/authenticate" , validateSchema(validateLoginSchema), loginAdmin)
UserRouter.post("/refresh-token" , refreshToken)
UserRouter.get("/logout", AuthenticateToken, logoutUser)
UserRouter.get(`/me/:userId`,AuthenticateToken, getCurrentUser)
UserRouter.patch(`/update-Admin/:userId`,AuthenticateToken, updateAdmin)
UserRouter.delete(`/delete/:userId`, AuthenticateToken,isAdmin(["super-admin"]), deleteAdmin)


export default UserRouter