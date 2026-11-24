import './App.css'
import Header from "./components/Header.tsx";
import LoginPage from "./pages/login/LoginPage.tsx";
import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import CreateQrCodePage from "./pages/qrcodes/create/CreateQrCodePage.tsx";
import QrCodeListPage from "./pages/qrcodes/list/QrCodeListPage.tsx";
import EditQrCodePage from "./pages/qrcodes/edit/EditQrCodePage.tsx";

function App() {

    return (
        <>
            <Header/>
            <Routes>
                <Route path={"/"}>
                    <Route index element={<HomePage/>}/>
                    <Route path={"login"} element={<LoginPage/>}/>
                    <Route path={"register"} element={<RegisterPage/>}/>
                    <Route path={"profile"} element={<ProfilePage/>}/>
                    <Route path={"qrcode"}>
                        <Route index element={<QrCodeListPage/>}/>
                        <Route path={"create"} element={<CreateQrCodePage/>}/>
                        <Route path={"edit/:id"} element={<EditQrCodePage/>}/>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App
