import './App.css'
import Header from "./components/Header.tsx";
import LoginPage from "./pages/login/LoginPage.tsx";
import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";

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
                </Route>
            </Routes>
        </>
    )
}

export default App
