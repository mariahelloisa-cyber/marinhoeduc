import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { HeroContent } from "@/hooks/useAdminData";

export const usePublicHero = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`public_hero_changes_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: "key=eq.hero" },
        () => {
          qc.invalidateQueries({ queryKey: ["public_hero"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["public_hero"],
    queryFn: async (): Promise<HeroContent | null> => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "hero")
        .maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as unknown as HeroContent | null;
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
