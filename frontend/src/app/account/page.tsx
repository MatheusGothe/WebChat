
import AccountPage from "@/components/Pages/Account"
import { Metadata } from "next"

export const metadata : Metadata = {
    title: "Minha conta"
}

const Account = () => {
  return (
    <AccountPage />
  )
}

export default Account