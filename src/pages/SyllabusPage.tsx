import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const SyllabusPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<{ title: string; description: string | null } | null>(null);

  useEffect(() => {
    if (!courseId) return;
    supabase.from("courses").select("title, description").eq("id", courseId).single()
      .then(({ data }) => setCourse(data));
  }, [courseId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Button>
        </Link>
        <h1 className="mb-2 font-display text-4xl font-bold text-gradient">{course?.title} - Syllabus</h1>
        <Card className="mt-6 shadow-card">
          <CardContent className="py-8">
            <p className="text-muted-foreground">
              {course?.description || "Syllabus details will be added soon. Please check back later."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SyllabusPage;
