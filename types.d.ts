import * as express from "express-serve-static-core";
import { UserProps } from "./src/models/user.model";

// Extending the Express Request interface globally
declare global {
    namespace Express {
        interface Request {
            user: Partial<UserProps | null>;
        }
    }
}
