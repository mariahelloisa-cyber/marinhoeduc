import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContactContent {
  phone_display: string;
  phone_whatsapp: string; // digits only, with country code, e.g. 5531733698845
  email: string;
  location: string;
}

export const DEFAULT_CONTACT: ContactContent = {
  phone_display: "(44) 9173-9553",
  phone_whatsapp: "554491739553",
  email: "marinhoeducacional@gmail.com",
  location: "Atendimento em todo o Brasil",
};

export const usePublicContact = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`public_contact_changes_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: "key=eq.contact" },
        () => {
          qc.invalidateQueries({ queryKey: ["public_contact"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["public_contact"],
    queryFn: async (): Promise<ContactContent> => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "contact")
        .maybeSingle();
      if (error) throw error;
      const v = (data?.value ?? null) as Partial<ContactContent> | null;
      return { ...DEFAULT_CONTACT, ...(v ?? {}) };
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
