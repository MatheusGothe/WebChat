"use client";
import { handleSignOut } from "@/lib/server/auth";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";
import Logo from "../../assets/logo.svg";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronDown, Home, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const Header = () => {
  const { setTheme } = useTheme();
  const { user, clearUser } = useAuthStore();
  const { setChat, showChatsList, setShowChatsList } = useChatStore();

  const pathname = usePathname();

  const handleLogOut = () => {
    handleSignOut();
    setChat(null);
    clearUser();

    toast.success("Deslogado com sucesso", { position: "top-center" });
  };
  return (
    <header className="h-header px-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-50 dark:border-slate-800">
      <nav className="flex items-center justify-between h-full max-w-full md:max-w-[80%] mx-auto">
        <div className="hidden min-[480px]:block" suppressHydrationWarning>
          <Link href="/">
            <Image
              src={Logo}
              alt="GRF Logo talk"
              width={170}
              height={40}
              unoptimized
            />
          </Link>
        </div>
        <Button
          className="flex min-[480px]:hidden"
          variant={"outline"}
          size={"icon"}
          asChild
        >
          <Link href="/">
            <Home className="size-[1.2rem]" />
          </Link>
        </Button>

        <div className="flex items-center gap-6">
          <Button
            className="flex lg:hidden cursor-pointer"
            size={"icon"}
            onClick={() => setShowChatsList(!showChatsList)}
          >
            <Menu className="size-[1.2rem]" />
            <span className="sr-only">Abrir/Fechar conversas</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer" variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alterar tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="cursor-pointer" align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem  className="cursor-pointer" onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem >
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-5">
                  <Avatar className="size-7">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>

                  <ChevronDown
                    className="size-5 text-slate-500 dark:text-slate-300"
                    strokeWidth={2.5}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/account">
                  <DropdownMenuItem>
                    <User className="mr-3 size-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleLogOut}
                >
                  <LogOut className="mr-3 size-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!user && pathname.startsWith("/auth") && (
            <div>
              {pathname !== "/auth/signin" ? (
                <Button  size={"sm"} asChild>
                  <Link href="/auth/signin">Entrar</Link>
                </Button>
              ) : (
                <Button size={"sm"} asChild>
                  <Link href="/auth/signup">Registrar</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
