import { workspaces } from "./workspaceData";

export default function WorkspaceSelector({ workspace, onWorkspaceChange, showDetails, onClose }) {
  return (
    <div className="space-y-1">
      {workspaces.map((item) => {
        const WorkspaceIcon = item.icon;
        const isSelected = workspace.name === item.name;

        return (
          <button
            key={item.name}
            onClick={() => {
              onWorkspaceChange(item);
              onClose();
            }}
            title={item.name}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${isSelected
              ? "bg-indigo-500/15 text-indigo-200"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
          >
            <WorkspaceIcon className="h-5 w-5 shrink-0" />
            {showDetails && <span className="truncate">{item.name}</span>}
          </button>
        );
      })}
    </div>
  );
}
