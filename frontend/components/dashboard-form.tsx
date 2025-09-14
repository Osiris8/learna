"use client";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Book,
  Bot,
  Brain,
  Code,
  GraduationCap,
  Languages,
  NotepadText,
  Paperclip,
  Square,
  Stethoscope,
  TreeDeciduous,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { Loader } from "@/components/prompt-kit/loader";
import { PromptSuggestion } from "./prompt-kit/prompt-suggestion";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PromptInputWithActions() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("tutor");
  const models =
    process.env.NEXT_PUBLIC_AI_MODEL?.split(",") || ["openai/gpt-oss-20b"];

  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleClick = (agentId: string) => {
    setSelectedAgent(selectedAgent === agentId ? "" : agentId);
  };
  const router = useRouter();

  const handleSubmit = async () => {
    const storedToken = localStorage.getItem("token");
    const storedInput = localStorage.setItem("storedInput", input);
    let finalPrompt = input.trim();
    if (input.trim() || files.length > 0) {
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

        finalPrompt = `${input.trim()}\n\n---\nhere my doc :\n${data.text}`;
      }

      setIsLoading(true);
      setInput("");
      setFiles([]);
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/chat`,
          {
            title: finalPrompt,
            model: selectedModel,
            agent: selectedAgent,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const chatId = res.data.chat_id;
        setIsLoading(false);
        router.push(`/chat/${chatId}`);
      } catch (error) {
        console.error(error);
        redirect("/login");
      } finally {
        setIsLoading(false);
        setInput("");
        setFiles([]);
      }
    }
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
    <div className="flex flex-col items-center justify-center mt-20 p-5">
      <h2 className="text-4xl font-medium mb-5">What do you want to learn ?</h2>
      {isLoading ? (
        <Loader
          variant={"text-shimmer"}
          text={"GPT-OSS Thinking..."}
          size={"lg"}
          className="mb-5"
        />
      ) : (
        ""
      )}
      <PromptInput
        value={input}
        onValueChange={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className="w-full max-w-(--breakpoint-md)"
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

        <PromptInputTextarea placeholder="Ask me anything..." />

        <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
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
                  accept="application/pdf"
                />
                <Paperclip className="text-primary size-5" />
              </label>
            </PromptInputAction>
           
         <PromptInputAction tooltip="Select a Model">
         <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Models</SelectLabel>
            {models.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
         </PromptInputAction>
          </div>
          <PromptInputAction
            tooltip={isLoading ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Square className="size-5 fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
      <div className="flex flex-row flex-wrap items-center justify-center m-8 p-5 gap-2">
        <PromptSuggestion onClick={() => setInput("Summarize")}>
        <NotepadText />Summarize
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInput("Translate")}>
        <Languages /> Translate
        </PromptSuggestion>
        <PromptSuggestion
          onClick={() => setInput("Learn")}
        >
         <Book /> Learn
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInput("Code")}>
        <Code />Code
        </PromptSuggestion>

      </div>
    </div>
  );
}
