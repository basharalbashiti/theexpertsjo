import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessageManager() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, read }: { id: number; read: boolean }) => {
      await apiRequest("PATCH", `/api/contact-messages/${id}/read`, { read });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact-messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      setSelectedMessage(null);
    },
  });

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markReadMutation.mutate({ id: msg.id, read: true });
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (selectedMessage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            data-testid="button-back-to-messages"
            variant="outline"
            size="sm"
            onClick={() => setSelectedMessage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to Messages
          </Button>
          <div className="ml-auto flex gap-2">
            <Button
              data-testid="button-toggle-read"
              variant="outline"
              size="sm"
              onClick={() => {
                markReadMutation.mutate({ id: selectedMessage.id, read: !selectedMessage.read });
                setSelectedMessage({ ...selectedMessage, read: !selectedMessage.read });
              }}
            >
              {selectedMessage.read ? "Mark Unread" : "Mark Read"}
            </Button>
            <Button
              data-testid="button-delete-message"
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Delete this message?")) {
                  deleteMutation.mutate(selectedMessage.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-neutral-900" data-testid="text-message-subject">
                {selectedMessage.subject || "(No Subject)"}
              </h3>
              <p className="text-sm text-neutral-500 mt-1" data-testid="text-message-date">
                {formatDate(selectedMessage.createdAt)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-400 font-medium">From:</span>
                <span className="ml-2 text-neutral-800 font-semibold" data-testid="text-message-name">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Email:</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="ml-2 text-primary hover:underline"
                  data-testid="text-message-email"
                >
                  {selectedMessage.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed" data-testid="text-message-body">
              {selectedMessage.message}
            </p>
          </div>

          <div className="border-t pt-4">
            <a
              href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-reply-email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
              Reply via Email
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Messages</h2>
          <p className="text-neutral-500 text-sm">
            {messages.length} total{unreadCount > 0 ? `, ${unreadCount} unread` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              data-testid={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-white border text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
              {f === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-neutral-300 mb-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><polyline points="22,6 12,13 2,6"/></svg>
          <p className="text-neutral-400 font-medium">
            {filter === "unread" ? "No unread messages" : filter === "read" ? "No read messages" : "No messages yet"}
          </p>
          <p className="text-neutral-300 text-sm mt-1">Messages from the contact form will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {filteredMessages.map((msg) => (
            <button
              key={msg.id}
              data-testid={`message-row-${msg.id}`}
              onClick={() => openMessage(msg)}
              className={`w-full text-left px-6 py-4 hover:bg-neutral-50 transition-colors flex items-start gap-4 ${
                !msg.read ? "bg-blue-50/30" : ""
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${!msg.read ? "bg-primary" : "bg-transparent"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-sm truncate ${!msg.read ? "font-bold text-neutral-900" : "font-medium text-neutral-600"}`}>
                    {msg.name}
                  </span>
                  <span className="text-xs text-neutral-400 shrink-0">{formatDate(msg.createdAt)}</span>
                </div>
                <p className={`text-sm truncate ${!msg.read ? "font-semibold text-neutral-800" : "text-neutral-600"}`}>
                  {msg.subject || "(No Subject)"}
                </p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{msg.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this message?")) {
                    deleteMutation.mutate(msg.id);
                  }
                }}
                className="shrink-0 p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                data-testid={`button-delete-msg-${msg.id}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}