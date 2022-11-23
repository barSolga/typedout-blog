import { Request } from "express";

export interface IUser {
    id: number,
    username: string,
    email: string,
    password: string
}

export interface IUserRequest extends Request {
    user?: any
}
