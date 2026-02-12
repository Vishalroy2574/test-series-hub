import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, FileQuestion } from "lucide-react";

interface TestSeries {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  total_questions: number | null;
  is_active: boolean | null;
}

interface Course {
  id: string;
  title: string;
}

const TestSeriesPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!courseId) return;
      const [courseRes, tsRes] = await Promise.all([
        supabase.from("courses").select("id, title").eq("id", courseId).single(),
        supabase.from("test_series").select("*").eq("course_id", courseId).eq("is_active", true).order("created_at"),
      ]);
      setCourse(courseRes.data);
      setTestSeries(tsRes.data || []);
      setLoading(false);
    };
    fetch();
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

        <h1 className="mb-2 font-display text-4xl font-bold text-gradient">
          {course?.title || "Loading..."}
        </h1>
        <p className="mb-8 text-muted-foreground">Available Test Series</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : testSeries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No test series available for this course yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {testSeries.map((ts) => (
              <Card key={ts.id} className="shadow-card transition-all hover:shadow-card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-display text-xl">{ts.title}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {ts.description && <p className="mb-4 text-sm text-muted-foreground">{ts.description}</p>}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {ts.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" /> {ts.total_questions} questions
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSeriesPage;
