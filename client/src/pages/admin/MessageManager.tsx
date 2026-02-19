import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useAdminLang } from "@/hooks/useAdminLang";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  deletedAt: string | null;
}

export default function MessageManager() {
  const { t, lang } = useAdminLang();
  const dir = lang === "AR" ? "rtl" : "ltr";
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [view, setView] = useState<"inbox" | "trash">("inbox");

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: trashedMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages/trash"],
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
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages/trash"] });
      setSelectedMessage(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/contact-messages/${id}/restore`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages/trash"] });
      setSelectedMessage(null);
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact-messages/${id}/permanent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages/trash"] });
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
    if (!msg.read && !msg.deletedAt) {
      markReadMutation.mutate({ id: msg.id, read: true });
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "AR" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilPurge = (deletedAt: string) => {
    const deleted = new Date(deletedAt);
    const purgeDate = new Date(deleted);
    purgeDate.setDate(purgeDate.getDate() + 30);
    const now = new Date();
    const diff = Math.ceil((purgeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  if (selectedMessage) {
    const isTrash = !!selectedMessage.deletedAt;
    return (
      <div className="space-y-6" dir={dir}>
        <div className="flex items-center gap-4">
          <Button
            data-testid="button-back-to-messages"
            variant="outline"
            size="sm"
            onClick={() => setSelectedMessage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === "AR" ? "rotate-180" : ""}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            {isTrash ? t("back_to_trash") : t("back_to_messages")}
          </Button>
          <div className={`${lang === "AR" ? "mr-auto" : "ml-auto"} flex gap-2`}>
            {isTrash ? (
              <>
                <Button
                  data-testid="button-restore-message"
                  variant="outline"
                  size="sm"
                  onClick={() => restoreMutation.mutate(selectedMessage.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  {t("restore")}
                </Button>
                <Button
                  data-testid="button-permanent-delete"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(t("permanent_delete_confirm"))) {
                      permanentDeleteMutation.mutate(selectedMessage.id);
                    }
                  }}
                >
                  {t("delete_forever")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  data-testid="button-toggle-read"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    markReadMutation.mutate({ id: selectedMessage.id, read: !selectedMessage.read });
                    setSelectedMessage({ ...selectedMessage, read: !selectedMessage.read });
                  }}
                >
                  {selectedMessage.read ? t("mark_unread") : t("mark_read")}
                </Button>
                <Button
                  data-testid="button-delete-message"
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(selectedMessage.id)}
                >
                  {t("delete")}
                </Button>
              </>
            )}
          </div>
        </div>

        {isTrash && selectedMessage.deletedAt && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {t("trash_warning")} {getDaysUntilPurge(selectedMessage.deletedAt)} {t("trash_warning_suffix")}
          </div>
        )}

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-neutral-900" data-testid="text-message-subject">
                {selectedMessage.subject || t("no_subject")}
              </h3>
              <p className="text-sm text-neutral-500 mt-1" data-testid="text-message-date">
                {formatDate(selectedMessage.createdAt)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-400 font-medium">{t("from")}</span>
                <span className={`${lang === "AR" ? "mr-2" : "ml-2"} text-neutral-800 font-semibold`} data-testid="text-message-name">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">{t("email_label")}</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className={`${lang === "AR" ? "mr-2" : "ml-2"} text-primary hover:underline`}
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

          {!isTrash && (
            <div className="border-t pt-4">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                data-testid="button-reply-email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === "AR" ? "rotate-180" : ""}><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                {t("reply_via_email")}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  const displayMessages = view === "inbox" ? filteredMessages : trashedMessages;

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{t("messages")}</h2>
          <p className="text-neutral-500 text-sm">
            {view === "inbox"
              ? `${messages.length} ${t("total")}${unreadCount > 0 ? `, ${unreadCount} ${t("unread")}` : ""}`
              : `${trashedMessages.length} ${t("in_trash")}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            data-testid="view-inbox"
            onClick={() => { setView("inbox"); setSelectedMessage(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === "inbox"
                ? "bg-primary text-white"
                : "bg-white border text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {t("inbox")}
            {unreadCount > 0 && (
              <span className={`${lang === "AR" ? "mr-1.5" : "ml-1.5"} px-1.5 py-0.5 rounded-full text-xs ${view === "inbox" ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            data-testid="view-trash"
            onClick={() => { setView("trash"); setSelectedMessage(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === "trash"
                ? "bg-primary text-white"
                : "bg-white border text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {t("trash")}
            {trashedMessages.length > 0 && (
              <span className={`${lang === "AR" ? "mr-1.5" : "ml-1.5"} px-1.5 py-0.5 rounded-full text-xs ${view === "trash" ? "bg-white/20" : "bg-neutral-200 text-neutral-600"}`}>
                {trashedMessages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {view === "inbox" && (
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              data-testid={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {f === "all" ? t("all") : f === "unread" ? t("unread_filter") : t("read_filter")}
            </button>
          ))}
        </div>
      )}

      {view === "trash" && trashedMessages.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg">
          {t("trash_auto_delete")}
        </div>
      )}

      {displayMessages.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-neutral-300 mb-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><polyline points="22,6 12,13 2,6"/></svg>
          <p className="text-neutral-400 font-medium">
            {view === "trash"
              ? t("trash_empty")
              : filter === "unread"
                ? t("no_unread")
                : filter === "read"
                  ? t("no_read")
                  : t("no_messages")}
          </p>
          <p className="text-neutral-300 text-sm mt-1">
            {view === "trash"
              ? t("deleted_appear_here")
              : t("messages_appear_here")}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {displayMessages.map((msg) => (
            <button
              key={msg.id}
              data-testid={`message-row-${msg.id}`}
              onClick={() => openMessage(msg)}
              className={`w-full text-${lang === "AR" ? "right" : "left"} px-6 py-4 hover:bg-neutral-50 transition-colors flex items-start gap-4 ${
                !msg.read && !msg.deletedAt ? "bg-blue-50/30" : ""
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${!msg.read && !msg.deletedAt ? "bg-primary" : "bg-transparent"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-sm truncate ${!msg.read && !msg.deletedAt ? "font-bold text-neutral-900" : "font-medium text-neutral-600"}`}>
                    {msg.name}
                  </span>
                  <span className="text-xs text-neutral-400 shrink-0">{formatDate(msg.createdAt)}</span>
                </div>
                <p className={`text-sm truncate ${!msg.read && !msg.deletedAt ? "font-semibold text-neutral-800" : "text-neutral-600"}`}>
                  {msg.subject || t("no_subject")}
                </p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{msg.message}</p>
                {msg.deletedAt && (
                  <p className="text-xs text-amber-500 mt-1">
                    {t("permanently_deletes_in")} {getDaysUntilPurge(msg.deletedAt)} {t("days")}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex gap-1">
                {view === "trash" ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreMutation.mutate(msg.id);
                      }}
                      className="p-2 text-neutral-300 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title={t("restore")}
                      data-testid={`button-restore-msg-${msg.id}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t("permanent_delete_confirm"))) {
                          permanentDeleteMutation.mutate(msg.id);
                        }
                      }}
                      className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title={t("delete_forever")}
                      data-testid={`button-perma-delete-msg-${msg.id}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(msg.id);
                    }}
                    className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t("move_to_trash")}
                    data-testid={`button-delete-msg-${msg.id}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
