// React hooks manage sidebar state and synchronize it with backend data.
import { useEffect, useState } from "react";
// Icons provide compact controls for collapsing, expanding, creating, and closing the sidebar.
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
// The profile API loads the signed-in user's display information.
import { getProfile } from "../api/authApi";
// Conversation APIs load, create, and delete chats for the selected workspace.
import {
  createConversation,
  deleteConversation,
  getConversations,
} from "../api/conversationApi";
// The document API uploads PDFs and starts their knowledge-base indexing.
import { uploadDocument } from "../api/documentApi";
// These child components keep workspace, document, upload, chat, and profile UI focused.
import WorkspaceSelector from "./sidebar/WorkspaceSelector";
import { workspaces } from "./sidebar/workspaceData";
import DocumentSelector from "./sidebar/DocumentSelector";
import UploadPanel from "./sidebar/UploadPanel";
import RecentChats from "./sidebar/RecentChats";
import ProfileMenu from "./sidebar/ProfileMenu";

export default function Sidebar({ userId, selectedConversationId, onConversationSelect, onConversationDelete, onProfileClick, onLogout, mobileOpen, onClose }) {
  // Collapse state controls the compact desktop sidebar while mobileOpen controls mobile visibility.
  const [isCollapsed, setIsCollapsed] = useState(false);
  // The first configured workspace is selected when the sidebar initially renders.
  const [workspace, setWorkspace] = useState(workspaces[0]);
  // Conversations are refreshed whenever the signed-in user or workspace changes.
  const [conversations, setConversations] = useState([]);
  // Separate loading flags keep chat creation and chat loading feedback independent.
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  // Upload state controls the progress message and prevents duplicate file submissions.
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  // These values store available company documents and the document used for new chats.
  const [allDocuments, setAllDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");



  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState("");
  const [deletingConversationId, setDeletingConversationId] = useState("");
  // Details remain visible on mobile and disappear only when the desktop sidebar is collapsed.
  const showDetails = !isCollapsed || mobileOpen;

  useEffect(() => {
    // Do not request conversations until a user has been identified.
    if (!userId) return;

    // Load conversations for the active workspace and expose failures in the sidebar.
    async function loadConversations() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getConversations(userId, workspace.value);
        setConversations(data);
      } catch (error) {
        setError(error.message);
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, [userId, workspace.value]);

  useEffect(() => {
    // Profile data is user-specific, so skip the request when no user is available.
    if (!userId) return;
    getProfile(userId)
      .then(setUser)
      .catch(() => setUser(null));
  }, [userId]);

  async function createNewChat() {
    // A chat cannot be created without a signed-in user.
    if (!userId) return;

    setIsCreating(true);
    setError("");

    try {
      // Company chats use the selected document; other workspaces do not need a document filter.
      const docIdToPass = workspace.value === "company" ? selectedDocumentId : null;
      console.log(`Document Id inside createNeewChat function: ${docIdToPass}`)

      const conversation = await createConversation(userId, workspace.value, docIdToPass);
      console.log(`conversation: ${JSON.stringify(conversation)}`)
      setConversations((previousConversations) => [conversation, ...previousConversations]);
      onConversationSelect(conversation);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteConversation(conversationId) {
    // Ask for confirmation because deleting a conversation cannot be undone from this view.
    const shouldDelete = window.confirm("Delete this conversation?");
    console.log(`conversationId inside sidebar.jsx: ${conversationId}`)

    if (!shouldDelete) return;

    setDeletingConversationId(conversationId);
    setError("");

    try {
      await deleteConversation(conversationId, userId);

      // Remove the deleted chat immediately so the visible list matches the server result.
      setConversations((previousConversations) =>
        previousConversations.filter((conversation) => conversation._id !== conversationId)
      );

      if (selectedConversationId === conversationId) {
        onConversationDelete(conversationId);
      }

      setOpenMenuId("");
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingConversationId("");
    }
  }



  // Reload company documents when entering that workspace or after a successful upload.
  useEffect(() => {
    if (workspace.value === "company") {
      import("../api/documentApi").then(({ getDocuments }) => {
        getDocuments()
          .then((data) => {
            setAllDocuments(data);
            if (data.length > 0) {
              // Selecting the first document gives new company chats a valid default target.
              setSelectedDocumentId(data[0]._id);
            }
          })
          .catch(console.error);
      });
    }
  }, [workspace.value, uploadMessage]); // Re-fetch documents whenever a new upload succeeds!

  // Upload a PDF, show its result, and reset the input so the same file can be selected again.
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage("Uploading & Indexing...");
    setUploadError("");

    try {
      const response = await uploadDocument(file);
      setUploadMessage(response.message);
      // Clear the success message after five seconds to keep the panel uncluttered.
      setTimeout(() => setUploadMessage(""), 5000);
    } catch (err) {
      setUploadError(err.message);
      setUploadMessage("");
    } finally {
      setIsUploading(false);
      // Reset the input so selecting the same file triggers the change event again.
      event.target.value = "";
    }
  }


  return (
    <aside
      className={`w-72 ${isCollapsed ? "md:w-20" : "md:w-72"} ${mobileOpen ? "fixed inset-y-0 left-0 z-50 flex shadow-2xl shadow-black/50" : "hidden"} h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-[#0d1526] p-3 transition-all duration-200 md:static md:z-auto md:flex md:shadow-none`}
    >
      <div className="mb-5 flex items-center justify-between px-1">
        {showDetails && (
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            NexusAI
          </h1>
        )}
        <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden" aria-label="Close sidebar">
          <X size={20} />
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:block"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <WorkspaceSelector
        workspace={workspace}
        onWorkspaceChange={setWorkspace}
        showDetails={showDetails}
        onClose={onClose}
      />

      {/* Only company workspace chats can be narrowed to a specific uploaded document. */}
      {workspace.value === "company" && showDetails && (
        <DocumentSelector
          documents={allDocuments}
          selectedDocumentId={selectedDocumentId}
          onDocumentChange={setSelectedDocumentId}
        />
      )}


      <button
        onClick={createNewChat}
        disabled={isCreating}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {showDetails && (isCreating ? "Creating..." : "New chat")}
      </button>

      {/* Hide uploads while chat history is expanded so the history gets the available space. */}
      {workspace.value === "company" && showDetails && !showRecentChats && (
        <UploadPanel
          isUploading={isUploading}
          uploadMessage={uploadMessage}
          uploadError={uploadError}
          onFileUpload={handleFileUpload}
        />
      )}


      {showDetails && (
        <RecentChats
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          showRecentChats={showRecentChats}
          isLoading={isLoading}
          error={error}
          openMenuId={openMenuId}
          deletingConversationId={deletingConversationId}
          onToggle={() => setShowRecentChats(!showRecentChats)}
          onConversationSelect={onConversationSelect}
          onMenuToggle={(conversationId) => setOpenMenuId(openMenuId === conversationId ? "" : conversationId)}
          onDelete={handleDeleteConversation}
          onClose={onClose}
        />
      )}

      <ProfileMenu
        user={user}
        showDetails={showDetails}
        showProfileMenu={showProfileMenu}
        onToggle={() => setShowProfileMenu(!showProfileMenu)}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
      />
    </aside>
  );
}
