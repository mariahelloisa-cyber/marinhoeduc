import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80&auto=format&fit=crop";

/** Public: published posts only, ordered by most recent. */
export const usePublishedPosts = (limit?: number) => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`blog_posts_public_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blog_posts" },
        () => {
          qc.invalidateQueries({ queryKey: ["public_blog_posts"] });
          qc.invalidateQueries({ queryKey: ["public_blog_post"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["public_blog_posts", limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DbBlogPost[];
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const usePublicPostBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["public_blog_post", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as DbBlogPost | null;
    },
    enabled: !!slug,
    staleTime: 0,
  });
};

/** Admin: all posts (published + drafts). */
export const useAdminPosts = () =>
  useQuery({
    queryKey: ["admin_blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DbBlogPost[];
    },
  });

const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["admin_blog_posts"] });
  qc.invalidateQueries({ queryKey: ["public_blog_posts"] });
  qc.invalidateQueries({ queryKey: ["public_blog_post"] });
};

export const useUpsertPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      post: Partial<DbBlogPost> & { title: string; slug: string }
    ) => {
      const { error } = await supabase
        .from("blog_posts")
        .upsert(post as any, { onConflict: "slug" });
      if (error) throw error;
    },
    onSuccess: () => invalidateAll(qc),
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateAll(qc),
  });
};

export const blogFallbackImage = FALLBACK_IMAGE;
