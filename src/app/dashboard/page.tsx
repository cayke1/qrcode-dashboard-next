"use client";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/components/Link";
import { Loader2 } from "lucide-react";

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
    <div className="bg-slate-700 w-full h-screen flex items-center justify-center">
      <div className="w-full md:w-2/3 bg-gray-400 px-6 py-8 flex flex-col gap-6 justify-center items-center rounded-lg shadow-lg">
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter title"
            onInput={(e) => setTitle(e.currentTarget.value)}
            value={title}
            className="w-full p-3 border-2 border-gray-300 rounded-md"
          />
        </div>

        {form === "image" && (
          <motion.div
            className="w-full max-w-lg bg-gray-200 p-6 rounded-md shadow-sm flex justify-center items-center"
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
            className="flex flex-col gap-4 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
          >
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="text"
              placeholder="Enter URL"
              defaultValue="https://"
              onInput={(e) => setUrl(e.currentTarget.value)}
              value={url}
              className="w-full p-3 border-2 border-gray-300 rounded-md"
            />
          </motion.div>
        )}

        <div className="flex justify-center items-center gap-4 mt-6">
          <Toggle
            className={clsx(
              "p-3 rounded-full transition-colors duration-300",
              form === "image" ? "bg-green-500" : "bg-blue-500"
            )}
            onClick={handleToggle}
            value={form}
          >
            {form === "image" ? "Switch to URL" : "Switch to Image"}
          </Toggle>

          <button
            className="bg-blue-500 px-4 py-2 rounded-2xl shadow-md disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span className="text-white">
              {loading ? "Loading..." : "Submit"}
            </span>
          </button>
        </div>

        {loading && (
          <div 
          className="animate-spin flex items-center justify-center text-white"
          >
            <Loader2 size={64} />
          </div>
        )}

        {links.length > 0 && (
          <div className="w-full max-w-lg mt-6 flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.id}
                id={link.id}
                title={link.slug}
                isActive={link.active}
                setActive={handleSetActive}
                deleteLink={handleDeleteLink}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
