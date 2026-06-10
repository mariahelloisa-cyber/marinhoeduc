import { Clock, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Course, formatPrice } from "@/data/courses";
import WhatsAppButton from "./WhatsAppButton";
import { cn } from "@/lib/utils";
import { getAreaPhoto } from "@/lib/areaPhotos";

const ACADEMIC_CATEGORIES = new Set([
  "cursos-tecnicos",
  "tecnico-competencia",
  "pos-tecnico",
  "tecnologo",
  "bacharelado",
  "superior-sequencial",
  "mestrado",
]);

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const isAcademic = ACADEMIC_CATEGORIES.has(course.category);
  const displayImage = course.image ?? getAreaPhoto(course.name, course.area, course.category);
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        course.highlight ? "border-accent ring-1 ring-accent/40" : "border-border",
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={displayImage}
          alt={course.name}
          loading="lazy"
          width={1024}
          height={640}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {course.highlight && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-soft">
            Mais procurado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {course.area && (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Tag className="h-3.5 w-3.5" />
            {course.area}
          </div>
        )}

        <h3 className="mt-3 font-display text-xl font-bold text-foreground">{course.name}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">
          {course.description ?? "Curso técnico reconhecido. Fale com um consultor para mais informações sobre matrícula e início das aulas."}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Duração: {course.duration}
          </span>
          {course.workload && (
            <span className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {course.workload}
            </span>
          )}
        </div>

        {typeof course.price === "number" && (
          <div className="mt-5 border-t border-border pt-5">
            <p className="text-xs font-medium text-muted-foreground">A partir de</p>
            <p className="font-display text-3xl font-bold text-primary">
              {formatPrice(course.price)}
              <span className="text-sm font-medium text-muted-foreground">/mês</span>
            </p>
          </div>
        )}

        {isAcademic ? (
          <Link
            to={`/cursos/${course.id}`}
            className={cn(
              "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold",
              "bg-primary text-primary-foreground shadow-cta",
              "transition-[transform,background-color,box-shadow] duration-300",
              "hover:-translate-y-0.5 hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
          >
            Saiba mais
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <WhatsAppButton
            className="mt-5 w-full"
            message={`Olá! Tenho interesse no curso ${course.name}. Gostaria de mais informações.`}
          >
            Quero me inscrever
          </WhatsAppButton>
        )}
      </div>
    </article>
  );
};

export default CourseCard;
