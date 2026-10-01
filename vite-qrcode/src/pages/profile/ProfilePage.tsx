import {useEffect, useState} from "react";
import api from "../../api/axiosInstance.ts";
import type {IProfile} from "./types.ts";

const ProfilePage = () => {

    const [profile, setProfile] = useState<IProfile>({
        id: 0,
        email: "",
        lastName: "",
        firstName: "",
        roles: [],
        image: ""
    });

    //UseEffect - спрацьовує після render page - відображення
    useEffect(() => {
        const getProfile = async () => {
            try {
                //Read data from server
                const result =
                    await api.get<IProfile>("/account/profile");
                setProfile(result.data);
                // console.log(result.data);
            }
            catch (ex) {
                console.log("Щось пішло не так", ex);
            }
        };
        getProfile(); //запускаємо асинхрону задачу на js
    }, []); // Спрацює 1 раз після відображення сторінки

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
                Особиста інформація
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Аватар */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-9 9a9 9 0 1 1 18 0H3Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <button
                        type="button"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Змінити фото
                    </button>
                </div>

                {/* Основна інформація */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Ім'я */}
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Ім'я
                        </label>

                        <input
                            id="firstName"
                            type="text"
                            value={profile.firstName}
                            placeholder="Введіть ім'я"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                        />
                    </div>

                    {/* Прізвище */}
                    <div>
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Прізвище
                        </label>

                        <input
                            id="lastName"
                            value={profile.lastName}
                            type="text"
                            placeholder="Введіть прізвище"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={profile.email}
                            placeholder="example@gmail.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                        />
                    </div>


                </div>

                {/* Кнопки */}
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        type="button"
                        className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    >
                        Скасувати
                    </button>

                    <button
                        type="button"
                        className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                    >
                        Зберегти зміни
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;