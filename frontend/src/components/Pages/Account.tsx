"use client";

import { updateUser } from "@/lib/requests";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { updateUserSchema, UpdateUserData } from "@/lib/schemas/userSchema"; // Para validação
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const AccountPage = () => {
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      confirm_password: "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: UpdateUserData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("avatar", avatar || "");
    if (data.password && data.password === data.confirm_password) {
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirm_password);
    }

    formData.append("password", data.password);
    formData.append("confirm_password", data.confirm_password);

    setLoading(true);
    const res = await updateUser(formData);
    setLoading(false);

    if (res.error) {
      toast.error(res.error.message, { position: "top-center" });
      return;
    }

    const user = res.data.user;
    setUser(user);

    form.setValue("name", user.name);
    form.setValue("email", user.email);
    form.setValue("password", "");
    form.setValue("confirm_password", "");
    setAvatar(user.avatar);
    toast.success("Dados atualizados com sucesso", { position: "top-center" });
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
        <Card className="w-full sm:w-[450px]">
          <CardContent>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pt-5"
              >
                <div className="space-y-3">
                  <div className="space-y-3">
                    <Label htmlFor="avatar">Avatar</Label>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11">
                        <AvatarImage
                          src={avatarUrl ?? user?.avatar}
                          alt={user?.name}
                        />
                        <AvatarFallback>
                          {user?.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <Input
                        id="avatar"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

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
                              autoComplete="new-password"
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
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => {
                      const [showPassword, setShowPassword] = useState(false);

                      return (
                        <FormItem>
                          <FormLabel>Confirme sua senha</FormLabel>
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
                <Button className="cursor-pointer w-full" disabled={loading}>
                  Atualizar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default AccountPage;
