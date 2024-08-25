import express from "express"
import { createUser, deleteAdmin, getCurrentUser, listUsers, loginAdmin, logoutUser } from "../../controllers/users/user.controller"
import { validateSchema } from "../../validations/schema/validateSchema"
import { createUserValidation, validateLoginSchema } from "../../validations/schema/user.joi"
import { isAdmin, isAuthenticated } from "../../middlewares/ensureLogin"
const UserRouter = express.Router()
UserRouter.get("/", isAuthenticated, isAdmin(["admin"]), listUsers)
UserRouter.post("/create-admin" , validateSchema(createUserValidation), createUser)
UserRouter.post("/authenticate" , validateSchema(validateLoginSchema), loginAdmin)
UserRouter.get("/logout", isAuthenticated, logoutUser)
UserRouter.get(`/me/:userId`,isAuthenticated, getCurrentUser)
UserRouter.delete(`/delete/:userId`, isAuthenticated,isAdmin(["super-admin"]), deleteAdmin)


export default UserRouter