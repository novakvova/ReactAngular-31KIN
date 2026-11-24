import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {AuthProvider} from "./context/AuthContext.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <>
        <GoogleOAuthProvider clientId="1023020461333-q2vicrpm2rnjreik8qcotc3s8e6af59p.apps.googleusercontent.com">
            <AuthProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </AuthProvider>
        </GoogleOAuthProvider>
    </>
)
