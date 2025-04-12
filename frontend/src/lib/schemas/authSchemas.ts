"use client";

import {z} from 'zod'

// Sign In
export const signInSchema = z.object({
    email: z.string().email({message: "Email inválido"}),
    password: z.string().min(6,{ message: "A senha deve ter pelo menos 6 caracteres."})
})

export type SignInData = z.infer<typeof signInSchema>

// Sign Up
export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(80, { message: "Nome excedeu o limite de 80 caracteres." }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .max(254, { message: "E-mail excedeu o limite de 254 caracteres." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/, {
      message:
        "A senha deve conter pelo menos uma letra, um número e um caractere especial",
    }),
});

export type SignUpData = z.infer<typeof signUpSchema>;

