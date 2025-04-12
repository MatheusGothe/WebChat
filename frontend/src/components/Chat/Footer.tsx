"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Laugh, Mic, Paperclip, SendHorizonal, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { BounceLoader } from "react-spinners";
import { Input } from "../ui/input";
import { useTheme } from "next-themes";
type Props = {
  onSendMessage: (data: {
    text?: string;
    attachment?: File | null;
    audio?: Blob | null;
  }) => void;
};

const Footer = ({ onSendMessage }: Props) => {
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [messageValue, setMessageValue] = useState("");
  const [messageAttachment, setMessageAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleToggleEmojiPicker = () => setEmojiPicker(!emojiPicker);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  // Formate o tempo em minutos e segundos, se necessário.
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleEmojiSelect = (data: { native: string }) => {
    setMessageValue(`${messageValue} ${data.native}`);
  };

  const handleUploadAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);

    if (file) setMessageAttachment(file);
  };

  const handleStartRecording = async () => {
    let stream: MediaStream | null = null;

    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        stream = streamData;
      } catch (error) {
        console.log(error);
        toast.error("Habilite as permissões do microfone", {
          position: "top-center",
        });
        return;
      }
    } else {
      toast.error("Navegador não tem suporte para gravar áudios", {
        position: "top-center",
      });
      return;
    }

    if (!stream) return;
    setIsRecording(true);

    const media = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.current = media;
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined" || event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const handleSendRecording = () => {
    if (!mediaRecorder.current) return;

    setIsRecording(false);

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      onSendMessage({ audio: audioBlob });
      setAudioChunks([]);
    };

    mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
  };

  const handleDeleteRecording = () => {
    if (!mediaRecorder.current) return;

    setIsRecording(false);

    mediaRecorder.current.stop();
    mediaRecorder.current
      .stream()
      .getTracks()
      .forEach((track) => track.stop());
  };

  const handleSendMessage = () => {
    onSendMessage({ text: messageValue, attachment: messageAttachment });
    setMessageAttachment(null);
    setMessageValue("");
  };

  return (
    <div>
      <div
        className={`fixed ml-2 ${
          emojiPicker ? "opacity-100 bottom-16" : "-bottom-[440px] opacity-0"
        } duration-300`}
      >
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme={theme.theme}
        />
      </div>
      {messageAttachment && (
        <div className=" flex items-center justify-between text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900/80 px-10 py-2 border-t ">
          <p className="text-xs">
            Arquivo carregado: {messageAttachment.name}.{messageAttachment.type}
          </p>
          <X
            onClick={() => setMessageAttachment(null)}
            className="size-4 hover:text-primary cursor-pointer"
          />
        </div>
      )}

      <div className="flex items-center gap-4 border-t bg-slate-100/80 dark:bg-slate-900/80 px-8 py-2.5">
        {isRecording ? (
          <div className="flex items-center gap-5">
            <Button
              variant="ghost"
              size="icon"
              title="Parar Gravação"
              onClick={handleDeleteRecording}
            >
              <Trash className="size-5 text-slate-500 dark:text-slate-300" />
            </Button>
            <div className="text-sm text-slate-500 dark:text-slate-300 items-center flex gap-2">
              <BounceLoader color="#f13434b3" size={17} />
              Gravação de voz em andamento — {formatTime(recordingTime)}
            </div>
            <Button
              className="ml-6"
              size="sm"
              title="Enviar mensagem de voz"
              onClick={handleSendRecording}
            >
              <SendHorizonal className="text-slate-100" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Button
                variant={"ghost"}
                size={"icon"}
                title="Emoji"
                onClick={handleToggleEmojiPicker}
              >
                <Laugh className="text-slate-500 dark:text-slate-300" />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                title="Anexo"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="text-slate-500 dark:text-slate-300" />
              </Button>

              <Input
                ref={fileInputRef}
                id="attachment"
                type="file"
                className="hidden"
                onChange={handleUploadAttachment}
              />
            </div>
            <div className="flex-1">
              <Input
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                placeholder="Escreva uma mensagem"
              />
            </div>
            <div>
              {!messageValue && !messageAttachment ? (
                <Button size={'icon'} title="Gravar Mensagem de voz" onClick={handleStartRecording} >
                  <Mic className="text-slate-100" />
                </Button>
              ) : (
                <Button size={'icon'} title="Enviar mensagem " onClick={handleSendMessage} >
                  <SendHorizonal className="text-slate-100" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Footer;
