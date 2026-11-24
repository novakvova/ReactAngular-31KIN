import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"; // у React Router v7: "react-router"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IPagedResult, IUser } from "./types.ts";
import api from "../../api/axiosInstance.ts";
import { searchSchema, type ISearchType } from "./searchSchema.ts";

const PAGE_SIZE = 10;

// Збираємо query-рядок: у URL потрапляють тільки непусті поля,
// page - тільки якщо більша за 1 (щоб адреса була чистою)
const buildParams = (filters: ISearchType, page: number): URLSearchParams => {
    const params = new URLSearchParams();
    if (filters.firstName) params.set("firstName", filters.firstName);
    if (filters.lastName) params.set("lastName", filters.lastName);
    if (filters.email) params.set("email", filters.email);
    if (page > 1) params.set("page", String(page));
    return params;
};

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Читаємо стан з URL
    const firstName = searchParams.get("firstName") ?? "";
    const lastName = searchParams.get("lastName") ?? "";
    const email = searchParams.get("email") ?? "";
    const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10) || 1, 1);

    const [users, setUsers] = useState<IUser[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ISearchType>({
        resolver: zodResolver(searchSchema),
        // Початкові значення форми беремо з URL
        defaultValues: { firstName, lastName, email },
    });

    // Синхронізуємо форму з URL: спрацьовує при кнопках "Назад/Вперед"
    // або коли користувач відкрив/вставив нове посилання
    useEffect(() => {
        reset({ firstName, lastName, email });
    }, [firstName, lastName, email, reset]);

    // Завантаження даних при зміні будь-якого параметра URL
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        const params: Record<string, string | number> = { page, pageSize: PAGE_SIZE };
        if (firstName) params.firstName = firstName;
        if (lastName) params.lastName = lastName;
        if (email) params.email = email;

        api.get<IPagedResult<IUser>>("/Users", {
            params,
            signal: controller.signal,
        })
            .then(response => {
                const { items, totalPages: tp, totalCount: tc } = response.data;

                // Якщо в посиланні вказана неіснуюча сторінка - переносимо на останню
                if (tp > 0 && page > tp) {
                    setSearchParams(
                        buildParams({ firstName, lastName, email }, tp),
                        { replace: true } // не засмічуємо історію браузера
                    );
                    return;
                }

                setUsers(items);
                setTotalPages(tp);
                setTotalCount(tc);
                setLoading(false);
            })
            .catch(ex => {
                if (ex.name === "CanceledError") return;
                console.log("У нас проблеми Хюстон", ex);
                setLoading(false);
            });

        return () => controller.abort();
    }, [page, firstName, lastName, email, setSearchParams]);

    // Натиснули "Шукати": пишемо фільтри в URL, сторінка скидається на 1
    const onSearch = (data: ISearchType) => {
        setSearchParams(buildParams(data, 1));
    };

    // Натиснули "Скинути": чистимо URL
    const onReset = () => {
        setSearchParams({});
    };

    const hasActiveFilters = Boolean(firstName || lastName || email);

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
        // Беремо ЗАСТОСОВАНІ фільтри з URL, а не з форми (там можуть бути ненатиснуті зміни)
        setSearchParams(buildParams({ firstName, lastName, email }, newPage));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const inputClass =
        "w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <>
            <div className="max-w-xl mx-auto mt-4 px-4 font-sans">
                <h1 className="text-center text-2xl font-bold mb-6">Список користувачів</h1>

                {/* Панель пошуку */}
                <form
                    onSubmit={handleSubmit(onSearch)}
                    className="mb-6 p-4 bg-white rounded-lg shadow space-y-3"
                    noValidate
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <input
                                {...register("firstName")}
                                placeholder="Ім'я"
                                className={inputClass}
                            />
                            {errors.firstName && (
                                <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                {...register("lastName")}
                                placeholder="Прізвище"
                                className={inputClass}
                            />
                            {errors.lastName && (
                                <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <input
                            {...register("email")}
                            placeholder="Email"
                            className={inputClass}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onReset}
                            disabled={loading || (!isDirty && !hasActiveFilters)}
                            className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Скинути
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Шукати
                        </button>
                    </div>
                </form>

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
};

export default HomePage;