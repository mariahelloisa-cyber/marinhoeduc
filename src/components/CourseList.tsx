import { List } from "lucide-react";
import type { Course } from "@/data/courses";

interface CourseListProps {
  /** Title shown in the gradient header (e.g. category label) */
  title: string;
  /** List of courses to display */
  courses: Course[];
}

/**
 * Display courses as a vertical list (modern table style).
 * - Numbered rows (01, 02, 03...)
 * - Course name (main highlight) — hover changes color, but row is NOT clickable
 * - Workload badge on the right
 *
 * Designed for high-volume listings as an alternative to <CourseCard />.
 */
const CourseList = ({ title, courses }: CourseListProps) => {
  const total = courses.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-primary via-primary-glow to-accent px-5 py-4 text-white md:px-6 md:py-5">
        <div className="flex items-center gap-3 min-w-0">
          <List className="h-5 w-5 shrink-0 opacity-90" aria-hidden="true" />
          <h3 className="truncate font-display text-lg font-bold md:text-xl">
            {title}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm md:text-sm">
          {total} {total === 1 ? "curso" : "cursos"}
        </span>
      </div>

      {/* Rows */}
      {total === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          Nenhum curso disponível nesta categoria.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {courses.map((course, idx) => (
            <li
              key={course.id}
              className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/50 md:gap-5 md:px-6 md:py-4"
            >
              {/* Index */}
              <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground/70 md:w-9 md:text-sm">
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Course name (hover color change, NOT clickable) */}
              <span className="flex-1 break-words text-sm font-semibold uppercase leading-snug text-foreground transition-colors group-hover:text-primary md:text-[15px]">
                {course.name}
              </span>

              {/* Workload */}
              {course.workload && (
                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground md:text-sm">
                  {course.workload}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
