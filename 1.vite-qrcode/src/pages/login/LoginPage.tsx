import type {ILoginResponse, ILoginType} from "./types.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "./validate.ts";
import clsx from "clsx";
import api from "../../api/axiosInstance.ts";
import {useNavigate} from "react-router";
import {useAuth} from "../../context/AuthContext.tsx";
import {useGoogleLogin} from "@react-oauth/google";

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

    const loginByGoogle = useGoogleLogin({
        onSuccess: async tokenResponse =>
        {
            const {access_token} = tokenResponse;
            try {
                const result =
                    await api.post<ILoginResponse>("/account/LoginByGoogle", {token: access_token});
                login(result.data.token);
                navigate("/"); //переходимо на головну
            }
            catch (error) {
                console.log("Login google is problem", error);
            }
            // console.log("Google token", access_token)
        },
    });


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
                            className="cursor-pointer w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium transition-colors"
                        >
                            Увійти
                        </button>

                        <button
                            onClick={() => loginByGoogle()}
                            type="button"
                            className="cursor-pointer w-full py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.5 5.5 0 0 1-2.4 3.61v3h3.89c2.28-2.1 3.55-5.2 3.55-8.64Z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.89-3c-1.08.72-2.46 1.15-4.05 1.15-3.12 0-5.77-2.11-6.72-4.95H1.26v3.09A12 12 0 0 0 12 24Z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.28 14.3A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.3V6.61H1.26A12 12 0 0 0 0 12c0 1.94.46 3.78 1.26 5.39l4.02-3.09Z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.75c1.77 0 3.36.61 4.61 1.8l3.46-3.46C17.94 1.12 15.24 0 12 0A12 12 0 0 0 1.26 6.61l4.02 3.09C6.23 6.86 8.88 4.75 12 4.75Z"
                                />
                            </svg>

                            Увійти через Google
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginPage;