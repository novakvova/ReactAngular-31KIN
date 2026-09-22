import type {ILoginResponse, ILoginType} from "./types.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "./validate.ts";
import clsx from "clsx";
import api from "../../api/axiosInstance.ts";
import {useNavigate} from "react-router";
import {useAuth} from "../../context/AuthContext.tsx";

const LoginPage = () => {

    const { login } = useAuth();

    const defaultValues : ILoginType ={
        email: "",
        password: ""
    }

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        // reset,
        setError, //Дозволяє в React-Hook-Form записувати помилку
        formState: {errors, /*isDirty*/}, //Якщо є помилки
    } = useForm<ILoginType>({
        resolver: zodResolver(loginSchema),
        defaultValues
    });

    const onSubmit = async (data: ILoginType) => {
        console.log("Submit data server", data);
        try {
            const result = await api.post<ILoginResponse>("/account/login", data);
            login(result.data.token);
            //localStorage.setItem("auth", result.data.token);
            navigate("/"); //переходимо на головну

            // console.log("Result login ", result);
        }
        catch (error) {
            console.log("У нас проблеми Хюстон", error);
            setError("root", { message: "Дані вказано не вірно" }); //Записуємо помиклу, що дані вказано не вірно
        }
    }


    return (
        <>
            <div className="flex items-center justify-center px-4 mt-20">
                <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-bold text-center text-gray-900">Вхід</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {errors.root && (
                            <div className="text-red-700 text-sm text-center">{errors.root.message}</div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className={clsx(
                                    "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none",
                                    {
                                        "border-red-500 focus:ring-red-500": errors.email,
                                        "border-gray-300 focus:ring-indigo-500": !errors.email,
                                    }
                                )}
                                {...register("email")}
                            />
                            {errors.email && (<div className={"text-red-700"}>{errors.email.message}</div>)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                            <input
                                type="password"
                                className={clsx(
                                    "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none",
                                    {
                                        "border-red-500 focus:ring-red-500": errors.password,
                                        "border-gray-300 focus:ring-indigo-500": !errors.password,
                                    }
                                )}
                                {...register("password")}
                            />
                            {errors.password && (<div className={"text-red-700"}>{errors.password.message}</div>)}
                        </div>


                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium transition-colors"
                        >
                            Увійти
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginPage;