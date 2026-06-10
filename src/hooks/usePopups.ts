import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Popup {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
  active: boolean;
  image_size?: "sm" | "md" | "lg" | "full";
}

export interface PopupsContent {
  items: Popup[];
}

export const DEFAULT_POPUPS: PopupsContent = { items: [] };

export const usePublicPopups = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`public_popups_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: "key=eq.popups" },
        () => qc.invalidateQueries({ queryKey: ["public_popups"] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["public_popups"],
    queryFn: async (): Promise<PopupsContent> => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "popups")
        .maybeSingle();
      if (error) throw error;
      const v = (data?.value ?? null) as Partial<PopupsContent> | null;
      return { items: v?.items ?? [] };
    },
    staleTime: 0,
  });
};

export const usePopupsContent = () =>
  useQuery({
    queryKey: ["site_content", "popups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "popups")
        .maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as unknown as PopupsContent | null;
    },
  });

export const useSavePopups = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: PopupsContent) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key: "popups", value: value as any }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_content", "popups"] });
      qc.invalidateQueries({ queryKey: ["public_popups"] });
    },
  });
};
