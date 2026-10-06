import {useEffect, useState} from "react";
import type {IPagedResult, IUser} from "./types.ts";
import api from "../../api/axiosInstance.ts";

const PAGE_SIZE = 10;

const HomePage = () => {

    //Список наших користувачів
    const [users, setUsers] = useState<IUser[]>([]);
    //Поточна сторінка та дані пагінації
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    //Даний метод спрацьовує коли компонент зрендерився
    // useEffect(() => {
    //     api.get<IPagedResult<IUser>>("/Users")
    //         .then(response =>
    //         {
    //             console.log("Дані від сервера",response.data);
    //             setUsers(response.data.items); //зберігаємо в компонент дані
    //         })
    //         .catch(ex => {
    //             console.log("У нас проблеми Хюстон", ex)
    //         });
    //     console.log("Home page mounted");
    // },[]);

    //Спрацьовує при монтуванні і щоразу, коли змінюється page
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        api.get<IPagedResult<IUser>>("/Users", {
            params: { page, pageSize: PAGE_SIZE },
            signal: controller.signal
        })
            .then(response => {
                console.log("Дані від сервера", response.data);
                setUsers(response.data.items);
                setTotalPages(response.data.totalPages);
                setTotalCount(response.data.totalCount);
                setLoading(false);
            })
            .catch(ex => {
                if (ex.name === "CanceledError") return; // запит скасовано — це не помилка
                console.log("У нас проблеми Хюстон", ex);
                setLoading(false);
            });

        return () => controller.abort(); // скасувати старий запит при зміні сторінки
    }, [page]);

    //Список номерів сторінок з "..." для великої кількості сторінок
    const getPageNumbers = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "...")[] = [1];
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    const changePage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages || newPage === page) return;
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    console.log("Home page rendered");

    return (
        <>
            <div className="max-w-xl mx-auto mt-4 px-4 font-sans">
                <h1 className="text-center text-2xl font-bold mb-6">Список користувачів</h1>

                <ul className={`space-y-3 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
                    {users.map(user => (
                        <li
                            key={user.id}
                            className="flex items-center gap-4 p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <img
                                src={`${import.meta.env.VITE_API_URL}/myimages/${user.image}_432.webp`}
                                alt={user.fullName}
                                className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{user.fullName}</span>
                                <span className="text-sm text-gray-500">{user.email}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                {loading && users.length === 0 && (
                    <p className="text-gray-400 text-sm mt-4">Завантаження користувачів...</p>
                )}

                {!loading && users.length === 0 && (
                    <p className="text-gray-400 text-sm mt-4">Користувачів не знайдено</p>
                )}

                {totalPages > 1 && (
                    <nav className="mt-6 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => changePage(page - 1)}
                                disabled={page === 1 || loading}
                                className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Назад
                            </button>

                            {getPageNumbers().map((p, index) =>
                                p === "..." ? (
                                    <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => changePage(p)}
                                        disabled={loading}
                                        className={`px-3 py-1 rounded border text-sm ${
                                            p === page
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "border-gray-300 hover:bg-gray-100"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => changePage(page + 1)}
                                disabled={page === totalPages || loading}
                                className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Далі
                            </button>
                        </div>

                        <span className="text-xs text-gray-400">
                            Сторінка {page} з {totalPages} (усього: {totalCount})
                        </span>
                    </nav>
                )}
            </div>
        </>
    );
}

export default HomePage;