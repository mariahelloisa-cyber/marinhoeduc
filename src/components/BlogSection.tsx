import { Link } from "react-router-dom";
import { Newspaper, ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import { usePublishedPosts } from "@/hooks/useBlogPosts";
import { blogPosts as fallbackPosts } from "@/data/blog";

const BlogSection = () => {
  const { data: posts, isLoading } = usePublishedPosts(3);

  const featured =
    posts && posts.length > 0
      ? posts
      : fallbackPosts.slice(0, 3).map((p) => ({
          slug: p.id,
          title: p.title,
          excerpt: p.excerpt,
          image_url: p.image,
          tag: p.tag,
        }));

  return (
    <section id="blog" className="bg-gradient-to-b from-background to-secondary/40 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Newspaper className="h-4 w-4" />
            Novidades
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-5xl">
            Últimas <span className="text-accent">Notícias</span> do Blog
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Fique por dentro das novidades, dicas e tendências do mundo educacional
          </p>
        </div>

        {isLoading && !posts ? (
          <div className="text-center text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featured.map((post) => (
              <BlogCard key={post.slug} post={post as any} />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center md:mt-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-cta)] transition-all hover:-translate-y-0.5 hover:shadow-cta"
            style={{ background: "var(--gradient-cta)" }}
          >
            Ver Todas as Notícias <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
