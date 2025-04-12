import SignInPage from "@/components/Pages/SignIn"

import { Metadata } from "next"

export const metadata : Metadata = {
    title: "Log-in"
}

const SignIn = () => {
  return (
    <SignInPage />
  )
}

export default SignIn