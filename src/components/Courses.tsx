import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePublicCourses } from "@/hooks/usePublicData";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";

const Courses = () => {
  const { data: courses = [] } = usePublicCourses();
  // Destaques: prioriza highlight, completa até 6 com os primeiros
  const featured = [
    ...courses.filter((c) => c.highlight),
    ...courses.filter((c) => !c.highlight),
  ].slice(0, 6);


  return (
    <section id="cursos" className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Cursos em destaque</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            Comece pelos cursos mais procurados
          </h2>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" variant="outline" className="font-semibold">
            <Link to="/cursos">
              Ver todos os cursos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
