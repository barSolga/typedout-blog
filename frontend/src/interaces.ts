export interface iUserResponse {
    user_id: number,
    username: string,
    email: string,
    password: string,
    role_id: number,
    token: string
}

export interface iUserRegister{
    username: string,
    email: string,
    password: string,
    password2: string,
    role_id: number
}

export interface iUserLogin {
    email: string,
    password: string
}

export interface iUser {
    user_id: number,
    username: string,
    email: string,
    role_id: number
}

export interface iToken {
    token: string
}

export interface AuthState {
    user: iUserResponse | iUserRegister | iUserLogin | null,
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string
}

export interface UsersState {
    user: iUser | string | null,
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string
}