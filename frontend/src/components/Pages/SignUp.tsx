"use client";

import { SignUpData, signUpSchema } from "@/lib/schemas/authSchemas";
import { handleSignUp } from "@/lib/server/auth";
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
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpData) => {
    setLoading(true);
    const response = await handleSignUp(values);

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
            <CardTitle>Crie uma conta</CardTitle>
            <CardDescription>
              Insira seu nome, e-mail e senha para criar uma conta.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: João da Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    render={({ field }) => (
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
                    )}
                  />
                </div>
                <Button className="cursor-pointer" disabled={loading}>
                  Registrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default SignUpPage;
