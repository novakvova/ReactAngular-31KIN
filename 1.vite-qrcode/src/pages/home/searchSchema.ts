import { z } from "zod";

// Усі поля необов'язкові: порожнє поле просто не враховується в пошуку.
// Email не валідуємо як email, бо шукати можна за частиною ("gmail")
export const searchSchema = z.object({
    firstName: z.string().trim().max(50, "Максимум 50 символів"),
    lastName: z.string().trim().max(50, "Максимум 50 символів"),
    email: z.string().trim().max(100, "Максимум 100 символів"),
});

export type ISearchType = z.infer<typeof searchSchema>;

export const searchDefaultValues: ISearchType = {
    firstName: "",
    lastName: "",
    email: "",
};