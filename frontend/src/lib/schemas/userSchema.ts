import { z } from "zod";

// Update User
export const updateUserSchema = z.object({
  name: z
    .string()         
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." })
    .max(80, { message: "Nome excedeu o limite de 80 caracteres." }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .max(254, { message: "E-mail excedeu o limite permitido" }),
  password: z
    .string()
    .max(80, { message: "Senha excedeu o limite permitido" })
    .refine(
      (value) =>
        !value ||
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/.test(value),
      {
        message:
          "A senha deve conter pelo menos uma letra, um número e um caractere especial",
      }
    ),
    confirm_password: z.string()
}).refine(data => data.password === data.confirm_password,{
    message: 'As senhas não correspondem',
    path: ['confirm_passwrord']
})

export type UpdateUserData = z.infer<typeof updateUserSchema>;
