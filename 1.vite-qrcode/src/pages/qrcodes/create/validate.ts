import {z} from "zod";

export const qrCodeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Вкажіть назву")
        .max(100, "Назва занадто довга"),
    targetUrl: z
        .string()
        .trim()
        .min(1, "Вкажіть посилання")
        .url("Некоректне посилання (напр. https://example.com)"),
});