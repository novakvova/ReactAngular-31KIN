import {Link, NavLink, Outlet} from "react-router";

const MainLayout = () => {
    return (
        <>
            <div className="pdr-app">
                <nav className="navbar navbar-expand-md pdr-navbar" data-bs-theme="dark">
                    <div className="container">
                        <Link className="navbar-brand fw-bold" to="/">🚗 ПДР Підготовка</Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#pdrMenu"
                            aria-controls="pdrMenu"
                            aria-expanded="false"
                            aria-label="Перемкнути меню"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="pdrMenu">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item"><NavLink className="nav-link" to="/" end>Головна</NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link" to="/tests">Тести</NavLink></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <Outlet/>

                <footer className="text-center text-muted small py-4">
                    © 2026 ПДР Підготовка. Усі права захищено.
                </footer>
            </div>
        </>
    )
}

export default MainLayout