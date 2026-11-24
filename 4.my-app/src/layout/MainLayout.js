import {Outlet} from "react-router";

const MainLayout = () => {
    return (
        <>
            <div className="pdr-app">
                <nav className="navbar navbar-expand-md pdr-navbar" data-bs-theme="dark">
                    <div className="container">
                        <a className="navbar-brand fw-bold" href="#top">🚗 ПДР Підготовка</a>
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
                                <li className="nav-item"><a className="nav-link active" href="#top">Головна</a></li>
                                <li className="nav-item"><a className="nav-link" href="#topics">Розділи</a></li>
                                <li className="nav-item"><a className="nav-link" href="#tips">Поради</a></li>
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