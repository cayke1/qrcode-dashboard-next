import clsx from "clsx";
import { motion } from "framer-motion";
import { ExternalLink, Trash2, Check } from "lucide-react";

interface LinkProps {
  id: string;
  title: string;
  isActive: boolean;
  totalLinks: number;
  setActive: (id: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
}
export function Link({
  id,
  title,
  isActive,
  totalLinks,
  setActive,
  deleteLink,
}: LinkProps) {
  const isOnlyLink = totalLinks === 1;
  
  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between gap-3 w-full items-start sm:items-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-all"
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className={clsx(
          "w-2 h-2 rounded-full flex-shrink-0",
          isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-500"
        )} />
        <h2 className="font-medium text-slate-800 dark:text-slate-100 truncate">{title}</h2>
      </div>
      
      <div className="flex gap-2 justify-start sm:justify-center items-center w-full sm:w-auto">
        <button
          className={clsx(
            "flex items-center gap-1 px-3 py-1.5 rounded-md text-white text-sm font-medium transition-colors flex-1 sm:flex-auto justify-center",
            isActive 
              ? "bg-slate-400 dark:bg-slate-500 cursor-not-allowed" 
              : "bg-emerald-500 hover:bg-emerald-600"
          )}
          onClick={() => setActive(id)}
          disabled={isActive}
        >
          {isActive ? (
            <>
              <Check size={14} className="flex-shrink-0" />
              <span className="truncate">Ativo</span>
            </>
          ) : (
            <>
              <ExternalLink size={14} className="flex-shrink-0" />
              <span className="truncate">Ativar</span>
            </>
          )}
        </button>
        <button
          className={clsx(
            "px-3 py-1.5 rounded-md text-white text-sm font-medium transition-colors flex items-center gap-1 flex-1 sm:flex-auto justify-center",
            isOnlyLink 
              ? "bg-red-300 dark:bg-red-800 cursor-not-allowed" 
              : "bg-red-500 hover:bg-red-600"
          )}
          onClick={() => !isOnlyLink && deleteLink(id)}
          disabled={isOnlyLink}
          title={isOnlyLink ? "Não é possível excluir o único link" : "Excluir link"}
        >
          <Trash2 size={14} className="flex-shrink-0" />
          <span className="truncate">Excluir</span>
        </button>
      </div>
    </motion.div>
  );
}
