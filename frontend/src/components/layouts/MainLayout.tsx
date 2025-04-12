"use client";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { ClipLoader } from "react-spinners";
import LeftSide from "./LeftSide";
import { Sheet, SheetContent } from "../ui/sheet";
import { User } from "@/types/User";
import { DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MainLayout = ({ children, user }: { children: React.ReactNode, user : User | null }) => {
  const auth = useAuthStore();
  const { showChatsList, setShowChatsList } = useChatStore();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
   
        if (user) auth.setUser(user);
        setLoading(false);

  }, []);


  return (
    <div className="h-screen w-screen overflow-hidden bg-slate dark:bg-slate-950">
      <Header />
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <ClipLoader color="#493cdd" />
        </div>
      ) : auth.user && !pathname.includes("auth") ? (
        <div className="flex h-full">
          <div className="hidden lg:block">
            <LeftSide />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}
  
      <Sheet open={showChatsList} onOpenChange={setShowChatsList}>
        <SheetContent className="p-0 bg-slate-100 dark:bg-slate-900">
          {/* Inclua o DialogTitle para acessibilidade */}
          <VisuallyHidden>
            <DialogTitle>Título Acessível</DialogTitle>
          </VisuallyHidden>
          <LeftSide variant="mobile" />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MainLayout;
