import { Trophy, Users, GraduationCap, BookOpen, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  Users,
  GraduationCap,
  BookOpen,
};

interface CourseCardProps {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

const CourseCard = ({ id, title, description, icon }: CourseCardProps) => {
  const IconComponent = iconMap[icon || "BookOpen"] || BookOpen;

  return (
    <Card className="group overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-muted bg-accent/50 transition-colors group-hover:border-primary/30">
          <IconComponent className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 font-display text-2xl font-bold text-primary">{title}</h3>
        {description && (
          <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <Link to={`/course/${id}/test-series`}>
            <Button size="sm" className="min-w-[100px]">View</Button>
          </Link>
          <Link to={`/course/${id}/syllabus`}>
            <Button size="sm" variant="outline" className="min-w-[100px]">Syllabus</Button>
          </Link>
          <Link to={`/course/${id}/test-series`}>
            <Button size="sm" variant="secondary" className="min-w-[100px]">View Test Series</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
