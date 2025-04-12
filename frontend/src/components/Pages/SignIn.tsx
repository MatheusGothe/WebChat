"use client";

import { SignInData, signInSchema } from "@/lib/schemas/authSchemas";
import { handleSignIn } from "@/lib/server/auth";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Eye, EyeOff } from "lucide-react"; // 👈 Import dos ícones
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInData) => {
    setLoading(true);
    const response = await handleSignIn(values);

    if (response?.error) {
      setLoading(false);
      toast.error(response.error.message, { position: "top-center" });

      return;
    }

    setUser(response.data.user);
    toast.success("Autenticado com sucesso", { position: "top-center" });
    router.push("/");
  };

  return (
    <main className="h-[var(--app-height)] flex items-center justify-center overflow-auto px-6">
      {loading ? (
        <>
          <div className="flex items-center justify-center h-full">
            <ClipLoader color="#493cdd" />
          </div>
        </>
      ) : (
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Entre na sua conta</CardTitle>
            <CardDescription>
              Insira seu e-mail e senha para acessar na sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: João da Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => {
                      const [showPassword, setShowPassword] = useState(false);

                      return (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Informe sua senha"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5 cursor-pointer" />
                                ) : (
                                  <Eye className="w-5 h-5 cursor-pointer" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <Button className="cursor-pointer" disabled={loading}>
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default SignInPage;
