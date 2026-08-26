// Icons distinguish profile navigation, settings, logout, and menu expansion actions.
import { ChevronDown, ChevronUp, LogOut, Settings, UserRound } from "lucide-react";

export default function ProfileMenu({ user, showDetails, showProfileMenu, onToggle, onProfileClick, onLogout }) {
  // The profile section stays at the bottom and exposes account actions when expanded.
  return (
    <div className="relative mt-auto shrink-0 border-t border-slate-800 pt-3">
      <button onClick={onToggle} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-800">
        {/* Use a stable fallback identity while profile data is loading or unavailable. */}
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-500 text-xs font-bold text-white">NA</span>
        {showDetails && <span className="min-w-0 text-left"><span className="block truncate text-sm font-medium text-slate-200">{user?.name || "Your profile"}</span><span className="block text-xs text-slate-500">Free plan</span></span>}
        {showDetails && (showProfileMenu ? <ChevronDown className="ml-auto h-4 w-4 text-slate-400" /> : <ChevronUp className="ml-auto h-4 w-4 text-slate-400" />)}
      </button>
      {/* Keep account actions hidden in collapsed mode and show them above the profile button. */}
      {showProfileMenu && showDetails && <div className="absolute bottom-full left-0 right-0 mb-2 space-y-1 rounded-xl border border-slate-700/80 bg-[#111b30] p-1 shadow-xl shadow-black/20">
        <button onClick={onProfileClick} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"><UserRound className="h-4 w-4 shrink-0" />Profile</button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"><Settings className="h-4 w-4 shrink-0" />Settings</button>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"><LogOut className="h-4 w-4 shrink-0" />Logout</button>
      </div>}
    </div>
  );
}
