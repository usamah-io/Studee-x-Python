import { BookOpen } from "lucide-react";

export default function LessonItem({ title, index, duration }) {
  return (
    <div className="w-full aspect-square flex flex-col justify-between p-4 rounded-xl app-theme-card hover:bg-black/5 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out cursor-pointer shadow-sm overflow-hidden">
      
      {/* Top: Icon */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/10 flex items-center justify-center text-[var(--text-color)] flex-shrink-0">
        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      
      {/* Middle: Title & Index */}
      <div className="flex flex-col flex-1 justify-center mt-2">
        <span className="text-[9px] app-theme-text-muted font-semibold uppercase tracking-wider mb-0.5">Materi {index}</span>
        <span className="text-xs sm:text-sm font-bold app-theme-text line-clamp-3 leading-snug">{title}</span>
      </div>
      
      {/* Bottom: Duration */}
      <div className="mt-2 flex">
        <span className="text-[9px] sm:text-[10px] text-[var(--text-color)]/80 font-bold bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md border border-[var(--border-color)]">
          {duration}
        </span>
      </div>
    </div>
  );
}
