import {useForm} from "react-hook-form";
import type {IRegisterType} from "./types.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {registerSchema} from "./validate.ts";
import {useState} from "react";
import api from "../../api/axiosInstance.ts";
import type {ILoginResponse} from "../login/types.ts";
import {useNavigate} from "react-router";
import {useAuth} from "../../context/AuthContext.tsx";

const RegisterPage = () => {

    const { login } = useAuth();

    const [preview, setPreview] = useState<string | null>(null);

    const defaultValues : IRegisterType ={
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        imageFile: null
    }

    const {
        register,
        handleSubmit,
        setValue, //Для запису даних у react-hook-form
        // reset,
        formState: {errors, /*isDirty*/}, //Якщо є помилки
    } = useForm<IRegisterType>({
        resolver: zodResolver(registerSchema),
        defaultValues
    });

    const navigate = useNavigate();

    const onSubmit = async (data: IRegisterType) => {
        // console.log("Submit data server", data);
        try {
            const result = await api.post<ILoginResponse>("/account/register", data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            //localStorage.setItem("auth", result.data.token);
            login(result.data.token);
            navigate("/"); //переходимо на головну

            // console.log("Result login ", result);
        }
        catch (error) {
            console.log("У нас проблеми Хюстон", error);
            //setError("root", { message: "Дані вказано не вірно" }); //Записуємо помиклу, що дані вказано не вірно
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        setValue("imageFile", file, { shouldValidate: true });

        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            setPreview(null);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center px-4 mt-10">
                <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-bold text-center text-gray-900">Реєстрація</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Прев'ю аватару"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">Фото</span>
                                )}
                            </div>

                            <label className="text-sm font-medium text-indigo-600 cursor-pointer hover:text-indigo-700">
                                Обрати зображення
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {errors.imageFile && (
                                <div className="text-red-700 text-sm">{errors.imageFile.message}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
                            <input
                                type="First name"
                                {...register("firstName")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {errors.firstName && (<div className={"text-red-700"}>{errors.firstName.message}</div>)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Прізвище</label>
                            <input
                                type="Last name"
                                {...register("lastName")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {errors.lastName && (<div className={"text-red-700"}>{errors.lastName.message}</div>)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {errors.email && (<div className={"text-red-700"}>{errors.email.message}</div>)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {errors.password && (<div className={"text-red-700"}>{errors.password.message}</div>)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Підтвердження пароля</label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {errors.confirmPassword && (<div className={"text-red-700"}>{errors.confirmPassword.message}</div>)}
                        </div>


                        <button
                            type="submit"
                            className="w-full py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium transition-colors"
                        >
                            Зареєструватися
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;