"use client";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/components/Link";
import { Loader2, Plus, Link2, Image as ImageIcon } from "lucide-react";

type formType = "url" | "image";
interface LinkType {
  id: string;
  slug: string;
  url: string;
  active: boolean;
}

export default function Dashboard() {
  const [form, setForm] = useState<formType>("url");
  const [url, setUrl] = useState<string>("https://");
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = () => {
    setForm((prev) => (prev === "url" ? "image" : "url"));
  };

  const fetchLinks = async () => {
    setLoading(true);
    const res = await fetch("/api/link/all");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (form === "image") {
        if (title && image) {
          const formData = new FormData();
          formData.append("file", image);
          try {
            const imageUrl = await fetch(
              `https://cloud.bytetribe.co/api/upload-raw`,
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await imageUrl.json();

            await fetch("/api/image/create", {
              method: "POST",
              body: JSON.stringify({ title, image: data.url }),
            });
          } catch (err: unknown) {
            console.error("Error submitting image", err);
            throw err;
          }
        }
      } else if (title && url) {
        await fetch("/api/link/create", {
          method: "POST",
          body: JSON.stringify({ title, url }),
        });
      }
      await fetchLinks();
    } catch (error) {
      console.error("Error submitting data", error);
    }
    setLoading(false);
  };

  const handleSetActive = async (id: string) => {
    try {
      await fetch(`/api/link/active/${id}`, {
        method: "PUT",
      });
      await fetchLinks();
    } catch (error) {
      console.error("Error setting active link", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await fetch(`/api/link/delete/${id}`, {
        method: "DELETE",
      });
      await fetchLinks();
    } catch (error) {
      console.error("Error deleting link", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen w-full flex items-center justify-center p-0 sm:p-4">
      <div className="w-full h-full min-h-screen sm:min-h-0 sm:h-auto sm:max-h-[90vh] md:w-2/3 lg:w-3/5 bg-white dark:bg-slate-800 px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 justify-start sm:justify-center items-center rounded-none sm:rounded-xl shadow-none sm:shadow-2xl overflow-y-auto">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
            QR Code Dashboard
          </h1>
          
          <div className="bg-slate-50 dark:bg-slate-700 p-4 sm:p-6 rounded-xl shadow-md mb-8">
            <div className="flex flex-col gap-4 w-full">
              <Label htmlFor="title" className="text-slate-700 dark:text-slate-200 font-medium">
                Título
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Digite o título"
                onInput={(e) => setTitle(e.currentTarget.value)}
                value={title}
                className="w-full p-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>

            {form === "image" && (
              <motion.div
                className="w-full bg-slate-100 dark:bg-slate-600 p-4 sm:p-6 rounded-xl shadow-sm flex justify-center items-center mt-4"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
              >
                <FileUpload onChange={(file) => setImage(file)} />
              </motion.div>
            )}

            {form === "url" && (
              <motion.div
                className="flex flex-col gap-4 w-full mt-4"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
              >
                <Label htmlFor="url" className="text-slate-700 dark:text-slate-200 font-medium">
                  URL
                </Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="Digite a URL"
                  defaultValue="https://"
                  onInput={(e) => setUrl(e.currentTarget.value)}
                  value={url}
                  className="w-full p-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                />
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mt-6">
              <Toggle
                className={clsx(
                  "p-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium w-full sm:w-auto justify-center",
                  form === "image" 
                    ? "bg-purple-500 hover:bg-purple-600 text-white" 
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
                onClick={handleToggle}
                value={form}
              >
                {form === "image" 
                  ? <><Link2 size={18} /> Mudar para URL</> 
                  : <><ImageIcon size={18} /> Mudar para Imagem</>}
              </Toggle>

              <button
                className={clsx(
                  "bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-lg shadow-md disabled:opacity-50 transition-colors flex items-center gap-2 text-white font-medium w-full sm:w-auto justify-center"
                )}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Adicionar
                  </>
                )}
              </button>
            </div>
          </div>

          {loading && !links.length && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={48} className="animate-spin text-blue-500" />
            </div>
          )}

          {links.length > 0 && (
            <div className="w-full mt-6 pb-6 sm:pb-0">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-white mb-4">
                Seus Links ({links.length})
              </h2>
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    id={link.id}
                    title={link.slug}
                    isActive={link.active}
                    totalLinks={links.length}
                    setActive={handleSetActive}
                    deleteLink={handleDeleteLink}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
