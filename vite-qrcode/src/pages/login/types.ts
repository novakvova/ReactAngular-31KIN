export interface  ILoginType {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
}

export interface ITokenInfo {
    email: string;
    roles: string;
    exp: number;
}