import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate, useParams} from "react-router";
import axios from "axios";
import api from "../../../api/axiosInstance.ts";
import type {IServerError} from "../../register/types.ts";
import type {IQrCodeEdit} from "./types.ts";
import {qrCodeEditSchema} from "./validate.ts";

const EditQrCodePage = () => {

    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<IQrCodeEdit>({
        resolver: zodResolver(qrCodeEditSchema),
        defaultValues: {
            name: "",
            targetUrl: "",
            isActive: true
        }
    });

    // Завантажуємо поточні дані QR-коду і підставляємо у форму
    useEffect(() => {
        const loadQrCode = async () => {
            try {
                const {data} = await api.get<IQrCodeEdit>(`/QrCodes/${id}`);
                reset({
                    name: data.name,
                    targetUrl: data.targetUrl,
                    isActive: data.isActive
                });
            }
            catch (error) {
                console.log("Не вдалося завантажити QR-код", error);
                setError("root", {message: "Не вдалося завантажити QR-код"});
            }
            finally {
                setIsLoading(false);
            }
        };

        loadQrCode();
    }, [id, reset, setError]);

    const onSubmit = async (data: IQrCodeEdit) => {
        try {
            // Бекенд очікує application/json: { name, targetUrl, isActive }
            await api.put(`/QrCodes/${id}`, data);
            navigate("/qrcode"); // після збереження переходимо на головну
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

    if (isLoading) {
        return <div className="text-center mt-10 text-gray-500">Завантаження...</div>;
    }

    return (
        <div className="flex items-center justify-center px-4 mt-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h1 className="text-2xl font-bold text-center text-gray-900">Редагування QR-коду</h1>

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

                    <div className="flex items-center gap-2">
                        <input
                            id="isActive"
                            type="checkbox"
                            {...register("isActive")}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Активний
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium transition-colors"
                    >
                        Зберегти
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditQrCodePage;