import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import SubNav from "@/components/SubNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { usePublicPostBySlug, blogFallbackImage } from "@/hooks/useBlogPosts";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePublicPostBySlug(slug);

  useEffect(() => {
    if (post?.title) document.title = `${post.title} | Blog Marinho Educacional`;
  }, [post?.title]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <SubNav />
      <main>
        {isLoading ? (
          <div className="container py-24 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !post ? (
          <div className="container py-24 text-center">
            <h1 className="font-display text-2xl font-bold">Post não encontrado</h1>
            <p className="mt-2 text-muted-foreground">
              O conteúdo que você procura não está disponível.
            </p>
            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao blog
            </Link>
          </div>
        ) : (
          <article>
            <header className="bg-gradient-to-b from-secondary/60 to-background py-12 md:py-20">
              <div className="container mx-auto max-w-3xl">
                <Link
                  to="/blog"
                  className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar ao blog
                </Link>
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.created_at)}
                </div>
                <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-5xl">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-4 text-lg text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </header>

            <div className="container mx-auto max-w-3xl pb-20">
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                <img
                  src={post.image_url || blogFallbackImage}
                  alt={post.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>

              {post.content && (
                <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground md:text-lg">
                  {post.content}
                </div>
              )}
            </div>
          </article>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default BlogPost;
