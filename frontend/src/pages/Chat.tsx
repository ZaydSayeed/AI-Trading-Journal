import { useState, useRef, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { Send, Bot, User } from "lucide-react";
import { format } from "date-fns";

export default function Chat() {
  const { messages, loading, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  return (
    <PageWrapper>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            AI Trading Coach
          </h1>
          <p className="text-muted-foreground mt-2">
            Get personalized coaching and insights about your trading performance
          </p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 flex flex-col p-0 h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0, 240, 255, 0.3) transparent' }}>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4 max-w-md">
                    <Bot className="h-16 w-16 mx-auto text-neon-cyan opacity-50" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Start a conversation
                      </h3>
                      <p className="text-muted-foreground">
                        Ask me anything about your trading performance, patterns,
                        or strategies. I'll analyze your trades and provide insights.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] space-y-1 ${
                      message.role === "user" ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    <div
                      className={`rounded-lg px-4 py-3 break-words ${
                        message.role === "user"
                          ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50"
                          : "bg-muted/50 text-foreground border border-border/50"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(message.timestamp, "HH:mm")}
                    </span>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-muted/50 rounded-lg px-4 py-3 border border-border/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-border p-4 flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your trading performance..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                variant="neon"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearMessages}
                >
                  Clear
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
