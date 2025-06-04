"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, User } from "lucide-react";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "company";
  timestamp: string;
  senderName: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  rfqTitle: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    text: "Bună ziua! Mulțumim pentru interesul acordat ofertei noastre.",
    sender: "company",
    timestamp: "2024-01-21 10:00",
    senderName: "MobilArt SRL",
  },
  {
    id: 2,
    text: "Am câteva întrebări suplimentare despre dimensiunile spațiului și preferințele dumneavoastră de design.",
    sender: "company",
    timestamp: "2024-01-21 10:01",
    senderName: "MobilArt SRL",
  },
  {
    id: 3,
    text: "Bună ziua! Vă mulțumesc pentru ofertă. Sunt interesat să aflu mai multe detalii.",
    sender: "user",
    timestamp: "2024-01-21 14:30",
    senderName: "Tu",
  },
];

export default function ChatModal({
  isOpen,
  onClose,
  companyName,
  rfqTitle,
}: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleString("ro-RO"),
      senderName: "Tu",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate company response after 2 seconds
    setTimeout(() => {
      const response: ChatMessage = {
        id: messages.length + 2,
        text: "Mulțumesc pentru mesaj! Vă voi răspunde în curând cu detaliile solicitate.",
        sender: "company",
        timestamp: new Date().toLocaleString("ro-RO"),
        senderName: companyName,
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Conversație cu {companyName}</DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Referitor la: {rfqTitle}
          </p>
        </DialogHeader>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 min-h-[400px] max-h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white dark:bg-gray-800 border"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {message.senderName}
                  </span>
                  <span className="text-xs opacity-70">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex space-x-2 pt-4 border-t">
          <Input
            placeholder="Scrie un mesaj..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
