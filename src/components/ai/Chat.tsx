import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatProps {
  initialMessages?: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

// Define the code element props type to include the inline property
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

// Custom renderers for markdown elements to improve appearance
const markdownRenderers: Components = {
  // Style headings with better typography and spacing
  h1: (props) => (
    <h1 className="text-xl font-semibold text-gray-900 mb-2 mt-3" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-3" {...props} />
  ),
  h3: (props) => (
    <h3
      className="text-base font-semibold text-gray-800 mb-1 mt-2"
      {...props}
    />
  ),
  // Enhance bullet points
  ul: (props) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
  // Style ordered lists
  ol: (props) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
  // Better formatting for list items
  li: (props) => <li className="text-gray-700" {...props} />,
  // Style links attractively
  a: ({ href, ...props }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  // Style bold text without showing asterisks
  strong: (props) => <span className="font-bold text-gray-900" {...props} />,
  // Style italics without showing asterisks
  em: (props) => <span className="italic text-gray-800" {...props} />,
  // Style code blocks with syntax highlighting appearance
  code: ({ className, inline, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !match && (inline || false);
    return (
      <code
        className={`${
          isInline
            ? "px-1 py-0.5 bg-gray-100 rounded"
            : "block p-2 bg-gray-100 overflow-x-auto my-2"
        } text-sm font-mono text-gray-800`}
        {...props}
      />
    );
  },
  // Better paragraphs with proper spacing
  p: (props) => <p className="mb-2 text-gray-800" {...props} />,
};

const Chat: React.FC<ChatProps> = ({
  initialMessages = [],
  onSendMessage,
  isLoading = false,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with initialMessages when they change
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Call the parent's onSendMessage method
    await onSendMessage(input);

    // Clear input after sending
    setInput("");
  };

  // Format timestamp to a readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] border rounded-lg overflow-hidden bg-white">
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200 animate-fadeIn"
                }`}
              >
                {message.role === "user" ? (
                  <div className="text-sm">{message.content}</div>
                ) : (
                  <div className="text-sm prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownRenderers}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
                <div
                  className={`text-xs mt-1 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200 shadow-sm">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-stone-600 hover:bg-stone-700"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
