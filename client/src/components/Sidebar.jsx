import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { getProfile } from "../api/authApi";
import {
  createConversation,
  deleteConversation,
  getConversations,
} from "../api/conversationApi";
import { uploadDocument } from "../api/documentApi";
import WorkspaceSelector from "./sidebar/WorkspaceSelector";
import { workspaces } from "./sidebar/workspaceData";
import DocumentSelector from "./sidebar/DocumentSelector";
import UploadPanel from "./sidebar/UploadPanel";
import RecentChats from "./sidebar/RecentChats";
import ProfileMenu from "./sidebar/ProfileMenu";

export default function Sidebar({ userId, selectedConversationId, onConversationSelect, onConversationDelete, onProfileClick, onLogout, mobileOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  //for document upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  //Add state to hold the list of all uploaded documents and track which one is currently selected by the user.
  const [allDocuments, setAllDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");



  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState("");
  const [deletingConversationId, setDeletingConversationId] = useState("");
  const showDetails = !isCollapsed || mobileOpen;

  useEffect(() => {
    if (!userId) return;

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
    if (!userId) return;
    getProfile(userId)
      .then(setUser)
      .catch(() => setUser(null));
  }, [userId]);

  async function createNewChat() {
    if (!userId) return;

    setIsCreating(true);
    setError("");

    try {
      // CRITICAL: Pass the selected document ID as the 3rd argument
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
    const shouldDelete = window.confirm("Delete this conversation?");
    console.log(`conversationId inside sidebar.jsx: ${conversationId}`)

    if (!shouldDelete) return;

    setDeletingConversationId(conversationId);
    setError("");

    try {
      await deleteConversation(conversationId, userId);

      // Remove the deleted chat from the current sidebar list.
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



  //Load available documents on workspace change :
  useEffect(() => {
    if (workspace.value === "company") {
      import("../api/documentApi").then(({ getDocuments }) => {
        getDocuments()
          .then((data) => {
            setAllDocuments(data);
            if (data.length > 0) {
              setSelectedDocumentId(data[0]._id); // Default to the first document in list
            }
          })
          .catch(console.error);
      });
    }
  }, [workspace.value, uploadMessage]); // Re-fetch documents whenever a new upload succeeds!

  // use to handle the pdf files
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage("Uploading & Indexing...");
    setUploadError("");

    try {
      const response = await uploadDocument(file);
      setUploadMessage(response.message);
      // Clear success message after 5 seconds
      setTimeout(() => setUploadMessage(""), 5000);
    } catch (err) {
      setUploadError(err.message);
      setUploadMessage("");
    } finally {
      setIsUploading(false);
      // Reset the file input element so user can upload same/new files again
      event.target.value = "";
    }
  }


  return (
    <aside
      className={`w-72 ${isCollapsed ? "md:w-20" : "md:w-72"} ${mobileOpen ? "fixed inset-y-0 left-0 z-50 flex shadow-2xl shadow-black/50" : "hidden"} h-screen min-h-0 shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-[#0d1526] p-3 transition-all duration-200 md:static md:z-auto md:flex md:shadow-none`}
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

      {/* Document Selector Dropdown - only visible for Company Knowledge Workspace */}
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

      {/* Hide the upload panel while recent chats are open to give chat history more space. */}
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
