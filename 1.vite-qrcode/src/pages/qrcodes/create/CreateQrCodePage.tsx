import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router";
import axios from "axios";
import api from "../../../api/axiosInstance.ts";
import type {IServerError} from "../../register/types.ts";
import type {IQrCodeCreate} from "./types.ts";
import {qrCodeSchema} from "./validate.ts";

const CreateQrCodePage = () => {

    const navigate = useNavigate();

    const defaultValues: IQrCodeCreate = {
        name: "",
        targetUrl: ""
    }

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<IQrCodeCreate>({
        resolver: zodResolver(qrCodeSchema),
        defaultValues
    });

    const onSubmit = async (data: IQrCodeCreate) => {
        try {
            // Бекенд очікує application/json: { name, targetUrl }
            await api.post("/QrCodes", data);
            navigate("/qrcode"); //після створення переходимо на головну
        }
        catch (error) {
            if (axios.isAxiosError<IServerError>(error)) {
                const message = error.response?.data?.error ?? "Щось пішло не так, спробуйте пізніше";
                setError("root", {message});
            }
            else {
                setError("root", {message: "Невідома помилка"});
            }
            console.log("У нас проблеми Хюстон", error);
        }
    }

    return (
        <div className="flex items-center justify-center px-4 mt-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h1 className="text-2xl font-bold text-center text-gray-900">Створення QR-коду</h1>

                {errors.root && (
                    <p className="text-red-500 text-sm">{errors.root.message}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Назва</label>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {errors.name && (<div className={"text-red-700"}>{errors.name.message}</div>)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Посилання (URL)</label>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            {...register("targetUrl")}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {errors.targetUrl && (<div className={"text-red-700"}>{errors.targetUrl.message}</div>)}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium transition-colors"
                    >
                        Створити
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateQrCodePage;