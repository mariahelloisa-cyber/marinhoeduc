import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbCategory {
  id: string;
  slug: string;
  label: string;
  sort_order: number;
  featured: boolean;
}

export interface DbCourse {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: string | null;
  workload: string | null;
  area: string | null;
  category_slug: string;
  image_url: string | null;
  highlight: boolean;
  sort_order: number;
  curriculum: string | null;
}

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as DbCategory[];
    },
  });

export const useCourses = () =>
  useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("sort_order")
        .order("name")
        .limit(2000);
      if (error) throw error;
      return data as DbCourse[];
    },
  });

export const useUpsertCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: Partial<DbCategory> & { slug: string; label: string }) => {
      const { error } = await supabase
        .from("categories")
        .upsert(cat as any, { onConflict: "slug" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useUpsertCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (course: Partial<DbCourse> & { slug: string; name: string; category_slug: string }) => {
      const { error } = await supabase
        .from("courses")
        .upsert(course as any, { onConflict: "slug" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
};

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  primary_button_label: string;
  primary_button_target: string;
  secondary_button_label: string;
  secondary_button_target: string;
  background_image_url: string;
  overlay_enabled?: boolean;
  extra_image_urls?: string[];
}

export const useHeroContent = () =>
  useQuery({
    queryKey: ["site_content", "hero"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "hero")
        .maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as unknown as HeroContent | null;
    },
  });

export const useSaveHero = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: HeroContent) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key: "hero", value: value as any }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_content", "hero"] }),
  });
};

import type { ContactContent } from "@/hooks/usePublicContact";

export const useContactContent = () =>
  useQuery({
    queryKey: ["site_content", "contact"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "contact")
        .maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as unknown as ContactContent | null;
    },
  });

export const useSaveContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: ContactContent) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key: "contact", value: value as any }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_content", "contact"] });
      qc.invalidateQueries({ queryKey: ["public_contact"] });
    },
  });
};

export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return data.publicUrl;
}
