import SignUpPage from "@/components/Pages/SignUp"
import { Metadata } from "next"

export const metadata : Metadata = {
    title: "Registrar-se"
}

const SignUp = () => {
  return (
    <SignUpPage />
  )
}

export default SignUp