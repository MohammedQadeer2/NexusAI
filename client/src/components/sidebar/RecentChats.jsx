import { ChevronDown, ChevronUp, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";

export default function RecentChats({
  conversations,
  selectedConversationId,
  showRecentChats,
  isLoading,
  error,
  openMenuId,
  deletingConversationId,
  onToggle,
  onConversationSelect,
  onMenuToggle,
  onDelete,
  onClose,
}) {
  return (
    <div className="mt-5 flex min-h-0 flex-1 flex-col">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 hover:bg-slate-800 hover:text-slate-300"
      >
        Recent chats
        {showRecentChats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {showRecentChats && <nav className="mt-1 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading && <p className="px-3 py-2 text-sm text-slate-500">Loading chats...</p>}
        {!isLoading && error && <p className="px-3 py-2 text-sm text-red-300">{error}</p>}
        {!isLoading && !error && conversations.length === 0 && (
          <p className="px-3 py-2 text-sm text-slate-500">No chats yet.</p>
        )}

        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            className={`flex items-center rounded-lg ${selectedConversationId === conversation._id
              ? "bg-slate-800 text-slate-100"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
          >
            <button
              onClick={() => {
                onConversationSelect(conversation);
                onClose();
              }}
              className="flex min-w-0 flex-1 items-center gap-2 truncate px-3 py-2 text-left text-sm"
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{conversation.title}</span>
            </button>

            <div className="relative pr-1">
              <button
                onClick={() => onMenuToggle(conversation._id)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label={`More options for ${conversation.title}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {openMenuId === conversation._id && (
                <div className="absolute right-0 top-9 z-20 w-28 rounded-lg border border-slate-700 bg-[#111b30] p-1 shadow-xl">
                  <button
                    onClick={() => onDelete(conversation._id)}
                    disabled={deletingConversationId === conversation._id}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingConversationId === conversation._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </nav>}
    </div>
  );
}
