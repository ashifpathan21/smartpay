import { z } from "zod";

export const SignBody = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string().optional()
})

export const LogBody = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(6)
})


export const UpdateBody = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    password: z.string().min(6)
})

export const UsernameBody = z.object({
    username: z.string().min(3).max(10)
})