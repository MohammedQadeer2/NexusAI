// The upload icon gives the file-picker control a clear visual affordance.
import { FileUp } from "lucide-react";

export default function UploadPanel({ isUploading, uploadMessage, uploadError, onFileUpload }) {
  // This presentational panel receives upload state and delegates file handling to the parent.
  return (
    <div className="mt-5 rounded-2xl border border-slate-800 bg-[#111b30]/60 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Knowledge Base Ingestion
      </p>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-[#0c1527] p-3 transition hover:border-indigo-500">
        {/* Change the icon animation and label while the server indexes the uploaded PDF. */}
        <FileUp className={`mb-1 h-6 w-6 ${isUploading ? "animate-bounce text-indigo-400" : "text-slate-400"}`} />
        <span className="text-xs font-medium text-slate-300">
          {isUploading ? "Indexing PDF..." : "Upload Company PDF"}
        </span>
        <span className="mt-1 text-[10px] text-slate-500">PDF up to 10MB</span>
        <input
          // The hidden input keeps the native file picker while the label supplies the custom UI.
          type="file"
          accept=".pdf"
          onChange={onFileUpload}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {uploadMessage && (
        // Show successful upload or indexing feedback only when the parent provides a message.
        <p className="mt-2 text-center text-xs font-medium text-emerald-400 animate-pulse">
          {uploadMessage}
        </p>
      )}
      {uploadError && (
        // Show a separate error message so failures remain visually distinct from success.
        <p className="mt-2 text-center text-xs font-medium text-red-400">
          {uploadError}
        </p>
      )}
    </div>
  );
}
