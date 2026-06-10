import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  name: string;
  role: string;
  city: string;
  text: string;
  rating: number;
}

export interface TestimonialsContent {
  items: Testimonial[];
}

export const DEFAULT_TESTIMONIALS: TestimonialsContent = {
  items: [
    {
      name: "Ana Carolina Souza",
      role: "Técnica em Enfermagem",
      city: "Salvador, BA",
      text: "Conseguir o diploma mudou minha vida. Hoje trabalho em hospital e meu salário praticamente dobrou. O suporte foi excelente do começo ao fim.",
      rating: 5,
    },
    {
      name: "Roberto Ferreira",
      role: "Técnico em Segurança do Trabalho",
      city: "Belo Horizonte, MG",
      text: "Aos 42 anos achei que não conseguiria voltar a estudar. As aulas online me permitiram conciliar com o trabalho e a família. Recomendo de olhos fechados.",
      rating: 5,
    },
    {
      name: "Marcia Oliveira",
      role: "Técnica em Administração",
      city: "Curitiba, PR",
      text: "Atendimento profissional, material completo e tutores muito atenciosos. Fui promovida na empresa logo após apresentar o certificado.",
      rating: 5,
    },
  ],
};

export const usePublicTestimonials = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`public_testimonials_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: "key=eq.testimonials" },
        () => qc.invalidateQueries({ queryKey: ["public_testimonials"] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["public_testimonials"],
    queryFn: async (): Promise<TestimonialsContent> => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "testimonials")
        .maybeSingle();
      if (error) throw error;
      const v = (data?.value ?? null) as Partial<TestimonialsContent> | null;
      if (!v?.items?.length) return DEFAULT_TESTIMONIALS;
      return { items: v.items };
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useTestimonialsContent = () =>
  useQuery({
    queryKey: ["site_content", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "testimonials")
        .maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as unknown as TestimonialsContent | null;
    },
  });

export const useSaveTestimonials = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: TestimonialsContent) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key: "testimonials", value: value as any }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_content", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public_testimonials"] });
    },
  });
};
