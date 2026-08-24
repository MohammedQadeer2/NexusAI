export default function DocumentSelector({ documents, selectedDocumentId, onDocumentChange }) {
  if (documents.length === 0) return null;

  return (
    <div className="mt-4 px-1">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Select Target Document
      </label>
      <select
        value={selectedDocumentId}
        onChange={(event) => onDocumentChange(event.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-[#0c1527] px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
      >
        {documents.map((document) => (
          <option key={document._id} value={document._id}>
            {document.filename}
          </option>
        ))}
      </select>
    </div>
  );
}
