"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("colors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    console.log("hello");
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App runing on Localhost :${PORT}`.red);
});
