import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { blogFallbackImage } from "@/hooks/useBlogPosts";

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt?: string | null;
  image_url?: string | null;
  created_at?: string;
  tag?: string;
}

interface BlogCardProps {
  post: BlogCardData;
}

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.image_url || blogFallbackImage}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
        {post.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            {post.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {post.created_at && (
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.created_at)}
            </span>
          </div>
        )}

        <h3 className="mb-3 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mb-6 line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-end border-t border-border pt-4">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
            Ler mais <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
