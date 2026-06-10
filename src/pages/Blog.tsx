import { Newspaper } from "lucide-react";
import Header from "@/components/Header";
import SubNav from "@/components/SubNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BlogCard from "@/components/BlogCard";
import { usePublishedPosts } from "@/hooks/useBlogPosts";
import { blogPosts as fallbackPosts } from "@/data/blog";

const Blog = () => {
  const { data: posts, isLoading } = usePublishedPosts();

  const list =
    posts && posts.length > 0
      ? posts
      : fallbackPosts.map((p) => ({
          slug: p.id,
          title: p.title,
          excerpt: p.excerpt,
          image_url: p.image,
          tag: p.tag,
        }));

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <SubNav />
      <main>
        <section className="bg-gradient-to-b from-secondary/60 to-background py-16 md:py-24">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Newspaper className="h-4 w-4" />
              Blog Marinho Educacional
            </div>
            <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-6xl">
              Últimas <span className="text-accent">Notícias</span> do Blog
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Fique por dentro das novidades, dicas e tendências do mundo educacional
            </p>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="container">
            {isLoading && !posts ? (
              <div className="text-center text-sm text-muted-foreground">Carregando...</div>
            ) : list.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                Nenhum post publicado ainda.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {list.map((post) => (
                  <BlogCard key={post.slug} post={post as any} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Blog;
