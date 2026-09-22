import {Link, useNavigate} from "react-router";
import {useAuth} from "../context/AuthContext.tsx";

const Header = () => {
    const {isAuthenticated, email, logout} = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link
                to="/"
                className="text-lg font-bold text-gray-900"
            >
                31КН-QRCode
            </Link>

            <div className="flex items-center gap-3">
                {isAuthenticated ? (
                    <>
                        <span className="text-sm text-gray-700">
                            {email}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                        >
                            Вихід
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                        >
                            Вхід
                        </Link>

                        <Link
                            to="/register"
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors"
                        >
                            Реєстрація
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
