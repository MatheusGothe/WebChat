"use server"

import { SignInData, SignUpData } from "@/lib/schemas/authSchemas"
import { signIn, signUp } from "../requests";
import { cookies } from "next/headers";
import { User } from "@/types/User";
import { redirect } from "next/navigation";


export const handleSignIn = async (data: SignInData) => {
    const response = await signIn(data);
    console.log(response)
    if (response.data) {
        const cookiesStore = await cookies();
        cookiesStore.set(
            process.env.NEXT_PUBLIC_AUTH_KEY as string,
            response.data.acess_token,
            {
                httpOnly: true,
                secure: true,
                path: "/",
                maxAge: 86400 * 7 // 7 dias
            }
        );
    }

    return response
};

export const handleSignUp = async (data: SignUpData) => {
    try {
        
        const response = await signUp(data);
        console.log('resopnse',response)
        if (response.data) {
            const cookiesStore = await cookies();
            cookiesStore.set(
                process.env.NEXT_PUBLIC_AUTH_KEY as string,
                response.data.access_token,
                {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    maxAge: 86400 * 7 // 7 dias
                }
            );
        }
    
        return response
    } catch (error) {
        console.log("erroAuth.ts",error)
    }
};


export const handleGetUser = async () => {

        try {
            
            const cookieStore = await cookies()
            const authCookie = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_KEY as string)?.value
            const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/v1/account/me', {
                headers: {
                    Authorization: `Bearer ${authCookie}`
                }
            })
          
        
            const jsonResponse = await response.json()
            const userData = jsonResponse.user
        
            if (userData) return userData as User
        
            return null
        } catch (error) {
            console.log('errorHandleGetUser',error)
        }
   
  
}

export const handleSignOut = async () => {
    const cookiesStore = await cookies(); // Aguarda a Promise ser resolvida
    cookiesStore.delete(process.env.NEXT_PUBLIC_AUTH_KEY as string);
    redirect('/auth/signin');
};


