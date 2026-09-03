import {useEffect, useState} from "react";
import axios from "axios";
import type {IUser} from "./types.ts";

const HomePage = () => {

    const url = "http://localhost:5124/api/Users";
    //Список наших користувачів
    const [users, setUsers] = useState<IUser[]>([]);
    //Даний метод спрацьовує коли компонент зрендерився
    useEffect(() => {
        axios.get<IUser[]>(url)
            .then(response =>
            {
                console.log("Дані від сервера",response.data)
                setUsers(response.data); //зберігаємо в компонент дані
            })
            .catch(ex => {
                console.log("У нас проблеми Хюстон", ex)
            });
        console.log("Home page mounted");
    },[]);

    console.log("Home page rendered");

    return (
        <>
            <div className="max-w-xl mx-auto mt-10 px-4 font-sans">
                <h1 className="text-2xl font-bold mb-6">Головна сторінка</h1>

                <ul className="space-y-3">
                    {users.map(user => (
                        <li
                            key={user.id}
                            className="flex items-center gap-4 p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <img
                                src={user.image}
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

                {users.length === 0 && (
                    <p className="text-gray-400 text-sm mt-4">Завантаження користувачів...</p>
                )}
            </div>
        </>
    );
}

export default HomePage;