import * as Yup from 'yup';

export const signUpSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Імʼя повинно містити щонайменше 2 символи')
        .max(20, 'Імʼя може містити максимум 20 символів')
        .required('Це поле обовʼязкове!'),
    email: Yup.string()
        .email('Введіть коректний e-mail')
        .required('Це поле обовʼязкове!'),
    password: Yup.string()
        .min(8, 'Пароль повинен містити не менше 8 символів')
        .max(40, 'Пароль може містити максимум 40 символів')
        .required('Це поле обовʼязкове!'),
});

export const signInSchema = Yup.object({
    email: Yup.string()
        .email('Введіть коректний e-mail')
        .required('Це поле обовʼязкове!'),
    password: Yup.string()
        .min(8, 'Пароль повинен містити не менше 8 символів')
        .max(40, 'Пароль може містити максимум 40 символів')
        .required('Це поле обовʼязкове!'),
});
