import {useEffect, useState} from "react";
import {Link} from "react-router";
import axios from "axios";
import api from "../../../api/axiosInstance.ts";
import type {IServerError} from "../../register/types.ts";
import QRCode from "react-qr-code";
import type {IQrCodeItem} from "./types.ts";

const QrCodeListPage = () => {

    const [items, setItems] = useState<IQrCodeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // id єдиного QR-коду, який зараз відкритий (null — усі сховані)
    const [openedId, setOpenedId] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await api.get<IQrCodeItem[]>("/QrCodes");
                setItems(result.data);
            } catch (err) {
                if (axios.isAxiosError<IServerError>(err)) {
                    setError(err.response?.data?.error ?? "Щось пішло не так, спробуйте пізніше");
                } else {
                    setError("Невідома помилка");
                }
                console.log("У нас проблеми Хюстон", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const toggleView = (id: number) => {
        setOpenedId(prev => (prev === id ? null : id));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 mt-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">QR-коди</h1>
                <Link
                    to="/qrcode/create"
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                >
                    Створити
                </Link>
            </div>

            {loading && <p className="text-gray-500">Завантаження...</p>}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!loading && !error && items.length === 0 && (
                <p className="text-gray-500">Поки що немає жодного QR-коду.</p>
            )}

            {items.length > 0 && (
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 font-medium">#</th>
                            <th className="px-4 py-3 font-medium">Назва</th>
                            <th className="px-4 py-3 font-medium">Посилання</th>
                            <th className="px-4 py-3 font-medium">QrCode</th>
                            <th className="px-4 py-3 font-medium">Статус</th>
                            <th className="px-4 py-3 font-medium">Створено</th>
                            <th className="px-4 py-3 font-medium text-right">Скани</th>
                            <th className="px-4 py-3 font-medium text-right">Дії</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {items.map(item => {
                            const urlCode = `${import.meta.env.VITE_API_URL}/api/QrCodes/scan/${item.code}`;
                            const isOpen = openedId === item.id;

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 align-top">
                                    <td className="px-4 py-3 text-gray-500">{item.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3 max-w-xs">
                                        <a
                                            href={item.targetUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block truncate text-indigo-600 hover:text-indigo-700"
                                            title={item.targetUrl}
                                        >
                                            {item.targetUrl}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        {isOpen ? (
                                            <div className="flex flex-col items-start gap-2">
                                                <div className="p-2 bg-white border border-gray-200 rounded-lg">
                                                    <QRCode value={urlCode} size={100} />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleView(item.id)}
                                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    Сховати
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => toggleView(item.id)}
                                                className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-medium transition-colors"
                                            >
                                                View
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                "inline-block px-2 py-0.5 rounded-full text-xs font-medium " +
                                                (item.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500")
                                            }
                                        >
                                            {item.isActive ? "Активний" : "Вимкнено"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.createAt}</td>
                                    <td className="px-4 py-3 text-right text-gray-900">{item.scanCount}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/qrcode/edit/${item.id}`}
                                            className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-medium transition-colors"
                                        >
                                            Редагувати
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default QrCodeListPage;