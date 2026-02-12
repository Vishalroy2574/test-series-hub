import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";

interface Course {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("courses").select("*").order("created_at");
      setCourses(data || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-hero-pattern py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 animate-fade-in-up font-display text-5xl font-extrabold tracking-tight text-gradient md:text-6xl">
            Our Test Series
          </h1>
          <p className="mx-auto max-w-xl animate-fade-in-up text-lg text-muted-foreground [animation-delay:0.15s]">
            Select a course
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-muted-foreground">No courses available yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
