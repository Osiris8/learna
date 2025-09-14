"use client";

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, Copy, Paperclip, X } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { redirect, usePathname } from "next/navigation";
import axios from "axios";

import { ScrollButton } from "@/components/prompt-kit/scroll-button";
import { Markdown } from "@/components/prompt-kit/markdown";

interface Message {
  id: number;
  sender: string;
  content: string;
}
import { Loader } from "@/components/prompt-kit/loader";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [agent, setAgent] = useState("");
  const [model, setModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [copied, setCopied] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const hasFetched = useRef(false);

  function handleCopy(text: string) {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    return navigator.clipboard.writeText(text);
  }
  const chatId = pathname ? pathname.split("/").pop() : null;
  const [variant, setVariant] = useState<"default" | "outline" | "secondary">(
    "default"
  );

  useEffect(() => {
    if (!chatId) return;
    const storedToken = localStorage.getItem("token");

    const fetchFirstMessage = async () => {
      const storedInput = localStorage.getItem("storedInput");
      if (!storedInput) return;
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/chat/${chatId}/first-message`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      setChatMessages((prev) => [
        ...prev,

        { id: 2, sender: "ai", content: "" },
      ]);

      if (reader) {
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullResponse += chunk;

          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.sender === "ai" ? { ...msg, content: fullResponse } : msg
            )
          );
        }
      }
      localStorage.setItem("storedInput", "");
      setIsLoading(false);
    };

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${chatId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        setChatMessages(res.data);
      } catch (err) {
        console.error("Error to display a data", err);
        redirect("/login");
      }
    };
    const fetchModel = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        
      
        setModel(res.data.model)
        setAgent(res.data.agent)
      } catch (err) {
        console.error("Error to display a data", err);
      }
    };

    fetchModel();
    if (!hasFetched.current) {
      fetchFirstMessage();
      hasFetched.current = true;
    }
    fetchMessages();
  }, [chatId]);

  const handleSubmit = async () => {
    const chatId = Number(`${pathname}`.split("/").pop());

    if (!prompt.trim()) return;
    if (!chatId) return;
    let finalPrompt = prompt.trim();
    const storedToken = localStorage.getItem("token");

    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Error to upload the file");

      const data = await res.json();

      finalPrompt = `${prompt.trim()}\n\n---\nHere my doc :\n${data.text}`;
    }

    setPrompt("");
    setIsLoading(true);

    // New user message
    const newUserMessage = {
      id: chatMessages.length + 1,
      sender: "user",
      content: prompt.trim(),
    };
    setChatMessages((prev) => [...prev, newUserMessage]);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/chat/${chatId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          content: finalPrompt,
          model: model,
          agent: agent,
        }),
      }
    );

    if (!res.body) throw new Error("Not streaming response");
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    // Add starting AI message
    const aiMessageId = chatMessages.length + 2;
    setChatMessages((prev) => [
      ...prev,
      { id: aiMessageId, sender: "ai", content: "" },
    ]);

    if (reader) {
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: fullResponse } : msg
          )
        );
      }
    }
    console.log(chatMessages);

    setIsLoading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto px-4 py-12">
        <ChatContainerContent className="space-y-12 px-4 py-12">
          {chatMessages.map((message, index) => {
            const isAssistant = message.sender === "ai";
            const isLastMessage = index === chatMessages.length - 1;

            return (
              <Message
                key={message.id}
                className={cn(
                  "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                  isAssistant ? "items-start" : "items-end"
                )}
              >
                {isAssistant ? (
                  <div className="group flex w-full flex-col gap-0">
                    <div className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0">
                      <Markdown className="prose lg:prose-lg dark:prose-invert">
                        {message.content}
                      </Markdown>
                    </div>
                    <MessageActions
                      className={cn(
                        "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                        isLastMessage && "opacity-100"
                      )}
                    >
                      <MessageAction tooltip="Copy" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleCopy(message.content)}
                        >
                          <Copy
                            className={`size-4 ${
                              copied ? "text-green-500" : ""
                            }`}
                          />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  </div>
                ) : (
                  <div className="group flex flex-col items-end gap-1">
                    <MessageContent
                      markdown
                      className="prose-h2:mt-0! prose-h2:scroll-m-0!"
                    >
                      {message.content}
                    </MessageContent>
                    <MessageActions
                      className={cn(
                        "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      )}
                    >
                      <MessageAction tooltip="Copy" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleCopy(message.content)}
                        >
                          <Copy
                            className={`size-4 ${
                              copied ? "text-green-500" : ""
                            }`}
                          />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  </div>
                )}
              </Message>
            );
          })}
          {isLoading ? (
            <Loader
              variant={"text-shimmer"}
              text={"GPT-OSS Thinking..."}
              size={"lg"}
              className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6 items-start"
            />
          ) : (
            ""
          )}
        </ChatContainerContent>
        <div className="absolute right-10 bottom-4">
          <ScrollButton variant={variant} />
        </div>
      </ChatContainerRoot>
      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <PromptInput
          isLoading={isLoading}
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={handleSubmit}
          className="w-full max-w-(--breakpoint-md) mb-10"
        >
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Paperclip className="size-4" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="hover:bg-secondary/50 rounded-full p-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything"
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />

            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
              <div className="flex justify-start gap-2 mt-2">
                <PromptInputAction tooltip="Attach files">
                  <label
                    htmlFor="file-upload"
                    className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Paperclip className="text-primary size-5" />
                  </label>
                </PromptInputAction>
             
                <PromptInputAction tooltip="AI model">
                  <Button variant="outline" className="rounded-full">
                    {model}
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  disabled={!prompt.trim() || isLoading}
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {!isLoading ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
