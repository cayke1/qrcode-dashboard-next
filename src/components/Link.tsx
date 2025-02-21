import clsx from "clsx";
import { motion } from "framer-motion";

interface LinkProps {
  id: string;
  title: string;
  isActive: boolean;
  setActive: (id: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
}
export function Link({
  id,
  title,
  isActive,
  setActive,
  deleteLink,
}: LinkProps) {
  return (
    <motion.div
      className="flex justify-between gap-4 w-full items-center border border-slate-500 rounded-md drop-shadow-sm px-4 py-2"
      initial={{ opacity: 0, scale: 0.8, x: -70 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="font-bol text-lg text-black">{title}</h2>
      <div className="flex gap-2 justify-center items-center p-2">
        <button
          className={clsx(
            "disabled:opacity-50",
            `${
              isActive ? "bg-red-500" : "bg-green-500"
            } p-2 rounded-md text-white`
          )}
          onClick={() => setActive(id)}
          disabled={isActive}
        >
          {isActive ? "Ativo" : "Ativar"}
        </button>
        <button
          className="bg-red-500 p-2 rounded-md text-white"
          onClick={() => deleteLink(id)}
        >
          Deletar
        </button>
      </div>
    </motion.div>
  );
}
