import type { Request } from "express"
import type { Types } from "mongoose"

export interface UserRequest extends Request {
    user?: {
        id: Types.ObjectId
    }
}