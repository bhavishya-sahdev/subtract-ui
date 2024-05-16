import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  "all",
  "entertainment",
  "software",
  "education",
  "lifestyle",
  "utility",
  "transportation",
  "health",
  "others",
];

export function CategoryBadges() {
  return (
    <ScrollArea className="w-full p-1 whitespace-nowrap rounded-md border hover:pb-3 transition-[padding] delay-200">
      <div className="flex w-max gap-2">
        {categories.map((category) => (
          <Badge variant="secondary" key={category}>
            {category}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
