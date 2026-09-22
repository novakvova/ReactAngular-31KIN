import {createContext, type FC, type PropsWithChildren, useContext, useState} from "react";
import {jwtDecode} from "jwt-decode";
import type {ITokenInfo} from "../pages/login/types.ts";

interface IAuthState {
    email: string | null;
}

interface IAuthContextValue extends IAuthState {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

//Як називаються дані в LocalStorage
export const AUTH_STORAGE_KEY = "auth";

const getIntialState = (): IAuthState =>
{
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if(!token) return {email: null};
    try {
        const decode = jwtDecode<ITokenInfo>(token)
        return {email: decode.email};
    }
    catch {
        return {email: null};
    }
}

const AuthContext = createContext<IAuthContextValue | null>(null);

export const AuthProvider : FC<PropsWithChildren> = ({ children }) => {
    const [auth, setAuth] = useState<IAuthState>(getIntialState);
    const login = (token: string) => {
        const decode = jwtDecode<ITokenInfo>(token);
        const newState = {token, email: decode.email};
        localStorage.setItem(AUTH_STORAGE_KEY, token);
        setAuth(newState);
    }
    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuth({email: null});
    }
    return (
        <AuthContext.Provider value={{...auth, isAuthenticated: !!auth.email, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}