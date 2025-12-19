import { config } from "dotenv";
config();


if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined")
}

if (!process.env.PORT) {
    throw new Error("PORT is not defined")
}


if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not Defined")
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined")
}

const PORT: Number = Number(process.env.PORT) || 4000;
const JWT_SECRET: string = process.env.JWT_SECRET;
const MONGO_URI: string = process.env.MONGO_URI;
const FRONTEND_URL: string = process.env.FRONTEND_URL;



export { JWT_SECRET, MONGO_URI, PORT, FRONTEND_URL }