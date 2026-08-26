// The shared workspace list supplies names and icons for each selectable workspace.
import { workspaces } from "./workspaceData";

export default function WorkspaceSelector({ workspace, onWorkspaceChange, showDetails, onClose }) {
  // Render one button for every workspace while preserving the active selection style.
  return (
    <div className="space-y-1">
      {workspaces.map((item) => {
        // Resolve the configured icon component so each workspace can render its own symbol.
        const WorkspaceIcon = item.icon;
        // Compare stable workspace names to determine which button is active.
        const isSelected = workspace.name === item.name;

        return (
          <button
            key={item.name}
            onClick={() => {
              // Notify the parent and close the mobile drawer after a workspace is chosen.
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
