import {
  createChatMessage,
  deleteChatMessage,
  getChatMessages,
} from "@/lib/requests";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { MarkMessageAsSeenEvent, UpdateMessageEvent } from "@/types/Message";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { socket } from "../layouts/Providers";
import dayjs from "dayjs";
import Header from "./Header";
import { ScaleLoader } from "react-spinners";
import { MessageItem } from "./MessageItem";
import Footer from "./Footer";

export const Chat = () => {
  const { chat, chatMessages, loading, setLoading, setChatMessages } =
    useChatStore();
  const { user } = useAuthStore();

  type GroupedMessages = {
    date: string;
    messages: typeof chatMessages;
  }[];

  const groupMessagesByDate = (
    messages: typeof chatMessages
  ): GroupedMessages => {
    const groups: Record<string, typeof chatMessages> = {};

    messages?.forEach((message) => {
      const date = dayjs(message.created_at).format("YYYY-MM-DD");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  };

  const formatDateDivider = (date: string) => {
    const day = dayjs(date);
    const today = dayjs();
    const yesterday = dayjs().subtract(1, "day");

    if (day.isSame(today, "day")) return "Hoje";
    if (day.isSame(yesterday, "day")) return "Ontem";
    return day.format("D [de] MMMM"); // ex: 10 de Abril
  };

  const bodyMessagesRef = useRef<HTMLDivElement>(null);

  const handleGetMessages = async () => {
    if (!chat) return;

    setLoading(true);
    const res = await getChatMessages(chat.id);
    setLoading(false);

    if (res.error || !res.data) {
      toast.error("Erro ao buscar mensagens", { position: "top-center" });
      return;
    }

    setChatMessages(res.data.messages);
  };

  const handleSendMessage = async ({
    text,
    attachment,
    audio,
  }: {
    text?: string;
    attachment?: File | null;
    audio?: Blob | null;
  }) => {
    if (!chat) return;

    const formData = new FormData();

    if (attachment) formData.append("file", attachment);
    if (audio) formData.append("audio", audio);
    if (text) formData.append("body", text);

    const res = await createChatMessage(chat.id, formData);

    if (res.error || !res.data) {
      toast.error(res.error.message, { position: "top-center" });
    }
  };

  const handleDeleteMessage = async (message_id: number) => {
    if (!chat) return;

    const res = await deleteChatMessage(chat.id, message_id);

    if (res.error || !res.data) {
      toast.error(res.error.message, { position: "top-center" });
    }
  };

  const scrollToBottom = () => {
    bodyMessagesRef.current?.scrollIntoView(false);
  };

  useEffect(() => {
    if (chatMessages === null) handleGetMessages();
  }, [chat]);

  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      scrollToBottom();
    }

    const handleUpdateMessage = (data: UpdateMessageEvent) => {
      if (chatMessages && data.query.chat_id === chat?.id) {
        switch (data.type) {
          case "create":
            if (data.message) setChatMessages([...chatMessages, data.message]);
            break;
          case "delete":
            setChatMessages(
              chatMessages.filter(
                (message) => message.id !== data.query.message_id
              )
            );
            break;
        }
        if (data.message && data.message.from_user.id !== user?.id) {
          socket.emit("update_messages_as_seen", {
            chat_id: chat.id,
            exclude_user_id: user?.id,
          });
        }
      }
    };

    const handleMarkMessageAsSeen = (data: MarkMessageAsSeenEvent) => {
      if (
        chatMessages &&
        data.query.chat_id === chat?.id &&
        data.query.exclude_user_id !== user?.id
      ) {
        const updatedMessages = chatMessages.map((message) => {
          if (message.viewed_at) return message;
          return {
            ...message,
            viewed_at: dayjs().toISOString(),
          };
        });
        setChatMessages(updatedMessages);
      }
    };

    socket.on("update_chat_message", handleUpdateMessage);
    socket.on("mark_messages_as_seen", handleMarkMessageAsSeen);

    return () => {
      socket.off("update_chat_message", handleUpdateMessage);
      socket.off("mark_messages_as_seen", handleMarkMessageAsSeen);
    };
  }, [chatMessages]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ScaleLoader color="#493cdd" />
          </div>
        ) : (
          <div className="space-y-8 p-7" ref={bodyMessagesRef}>
            {groupMessagesByDate(chatMessages || []).map((group) => (
              <div key={group.date} className="space-y-2">
                <div className="flex justify-center">
                  <span className="text-xs text-gray-400">
                    {formatDateDivider(group.date)}
                  </span>
                </div>
                {group.messages.map((data) => (
                  <div
                    key={data.id}
                    className={`flex ${
                      data.from_user.id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <MessageItem data={data} onDelete={handleDeleteMessage} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer onSendMessage={handleSendMessage} />
    </div>
  );
};
