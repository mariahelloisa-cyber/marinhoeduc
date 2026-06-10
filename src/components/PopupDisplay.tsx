import { useEffect, useMemo, useState } from "react";
import { usePublicPopups, type Popup } from "@/hooks/usePopups";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sizeClass = (size?: Popup["image_size"]) => {
  switch (size) {
    case "sm":
      return "h-48";
    case "lg":
      return "h-[28rem]";
    case "full":
      return "h-[70vh]";
    case "md":
    default:
      return "h-72";
  }
};

const PopupDisplay = () => {
  const { data } = usePublicPopups();
  const active = useMemo(() => (data?.items ?? []).filter((p) => p.active), [data]);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (active.length > 0) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [active.length]);

  useEffect(() => {
    if (!open || active.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % active.length);
    }, 5000);
    return () => clearInterval(id);
  }, [open, active.length]);

  if (active.length === 0) return null;
  const current = active[index % active.length];

  const goPrev = () => setIndex((i) => (i - 1 + active.length) % active.length);
  const goNext = () => setIndex((i) => (i + 1) % active.length);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg overflow-hidden">
        <div className="relative flex items-center">
          {active.length > 1 && (
            <button
              onClick={goPrev}
              aria-label="Pop-up anterior"
              className="absolute left-0 z-10 -ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md border hover:bg-muted transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex-1 px-6">
            {current.image_url && (
              <img
                src={current.image_url}
                alt={current.title}
                className={cn("w-full rounded-md object-cover", sizeClass(current.image_size))}
              />
            )}
            {(current.title || current.content) && (
              <DialogHeader>
                {current.title && <DialogTitle>{current.title}</DialogTitle>}
                {current.content && (
                  <DialogDescription className="whitespace-pre-line">{current.content}</DialogDescription>
                )}
              </DialogHeader>
            )}
            {current.cta_label && current.cta_url && (
              <div className="flex justify-end">
                <Button asChild>
                  <a href={current.cta_url} target="_blank" rel="noreferrer">
                    {current.cta_label}
                  </a>
                </Button>
              </div>
            )}
          </div>

          {active.length > 1 && (
            <button
              onClick={goNext}
              aria-label="Próximo pop-up"
              className="absolute right-0 z-10 -mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md border hover:bg-muted transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {active.length > 1 && (
          <div className="flex justify-center gap-2 pt-2">
            {active.map((p, i) => (
              <button
                key={p.id}
                aria-label={`Pop-up ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === index % active.length ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PopupDisplay;
