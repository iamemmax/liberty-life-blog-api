import { NextFunction, Request, Response } from "express-serve-static-core";
import Joi, { ObjectSchema } from "joi";

export const validateSchema = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value, error } = await schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                status: "fail",
                message: error.details.map((x) => x.message).join(", "),
            });
        }

        if (value) {
            req.body = value; // Optionally, you can assign the validated value back to req.body
            return next();
        }
    } catch (err: any) {
        console.error("Validation error:", err.message);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred during validation.",
        });
    }
};
