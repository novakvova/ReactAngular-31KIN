import { z } from "zod";

export const loginSchema = z
    .object({
        email: z
            .email("Введіть коректний email"),

        password: z
            .string()
            .min(6, "Пароль повинен містити мінімум 8 символів"),
    });