import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "Ім'я повинно містити мінімум 2 символи"),

        lastName: z
            .string()
            .min(2, "Прізвище повинно містити мінімум 2 символи"),

        email: z
            .email("Введіть коректний email"),

        password: z
            .string()
            .min(6, "Пароль повинен містити мінімум 6 символів"),

        confirmPassword: z
            .string()
            .min(1, "Підтвердіть пароль"),

        imageFile: z
            .instanceof(File, { message: "Оберіть файл зображення" })
            .nullable()
            .refine((file) => file !== null, "Зображення обов'язкове")
            .refine(
                (file) => !file || file.size <= MAX_FILE_SIZE,
                "Максимальний розмір файлу — 5MB"
            )
            .refine(
                (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
                "Дозволені формати: JPEG, PNG, WEBP"
            ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Паролі не співпадають",
        path: ["confirmPassword"],
    });