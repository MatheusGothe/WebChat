import { NewChatData, newChatSchema } from "@/lib/schemas/chatSchema";
import { useChatStore } from "@/stores/chatStore";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChat } from "@/lib/requests";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewChat = () => {
  const { setChat, showNewChat, setShowNewChat } = useChatStore();

  const form = useForm<NewChatData>({
    resolver: zodResolver(newChatSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: NewChatData) => {
    const response = await createChat(values);

    if (response.data) {
      setChat(response.data.chat);
      setShowNewChat(false);
      form.setValue("email", "");

      return;
    }

    toast.error(response.error.message, { position: "top-center" });
  };

  return (
    <Drawer open={showNewChat} onOpenChange={setShowNewChat}>
      <DrawerContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-lg"
          >
            <DrawerHeader>
              <DrawerTitle>Nova Conversa</DrawerTitle>
              <DrawerDescription>Insira o e-mail do usuário</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: joão@gmail.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter className="mt-8">
              <Button type="submit">Iniciar conversa</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default NewChat;
