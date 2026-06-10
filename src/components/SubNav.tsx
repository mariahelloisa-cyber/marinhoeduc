import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePublicCategories } from "@/hooks/usePublicData";

const SubNav = () => {
  const { search, pathname } = useLocation();
  const activeSlug = new URLSearchParams(search).get("categoria");
  const { data: categories } = usePublicCategories();

  const items = (categories ?? [])
    .filter((c: any) => c.featured)
    .slice(0, 6);

  return (
    <div className="sticky top-20 z-30 w-full bg-[hsl(var(--hero-bar))] text-primary-foreground border-b-2 border-accent">
      <nav
        className="container flex h-10 items-center overflow-x-auto md:h-11"
        aria-label="Categorias de cursos"
      >
        <ul className="mx-auto flex min-w-max items-center gap-1 sm:gap-2 md:gap-4">
          {items.map((item) => {
            const isActive = pathname === "/cursos" && activeSlug === item.slug;
            return (
              <li key={item.slug}>
                <Link
                  to={`/cursos?categoria=${item.slug}`}
                  className={cn(
                    "relative inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors sm:text-sm",
                    "hover:bg-primary-foreground/10",
                    isActive
                      ? "text-primary-foreground bg-primary-foreground/10"
                      : "text-primary-foreground/90 hover:text-primary-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SubNav;
