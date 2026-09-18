export interface IRegisterType
{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    imageFile: File|null; //Зображення, яке обирає користувач при реєстрації
}