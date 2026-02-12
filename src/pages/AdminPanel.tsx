import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

interface TestSeries {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  total_questions: number | null;
  is_active: boolean | null;
}

const AdminPanel = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // Course form
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseIcon, setCourseIcon] = useState("BookOpen");

  // Test series form
  const [tsTitle, setTsTitle] = useState("");
  const [tsDesc, setTsDesc] = useState("");
  const [tsDuration, setTsDuration] = useState("60");
  const [tsQuestions, setTsQuestions] = useState("0");

  const fetchData = async () => {
    const [cRes, tsRes] = await Promise.all([
      supabase.from("courses").select("*").order("created_at"),
      supabase.from("test_series").select("*").order("created_at"),
    ]);
    setCourses(cRes.data || []);
    setTestSeries(tsRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const addCourse = async () => {
    if (!courseTitle.trim()) return toast.error("Enter course title");
    const { error } = await supabase.from("courses").insert({ title: courseTitle, description: courseDesc || null, icon: courseIcon });
    if (error) return toast.error(error.message);
    toast.success("Course added!");
    setCourseTitle(""); setCourseDesc("");
    fetchData();
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Course deleted!");
    fetchData();
  };

  const addTestSeries = async () => {
    if (!selectedCourse) return toast.error("Select a course");
    if (!tsTitle.trim()) return toast.error("Enter test series title");
    const { error } = await supabase.from("test_series").insert({
      course_id: selectedCourse,
      title: tsTitle,
      description: tsDesc || null,
      duration_minutes: parseInt(tsDuration) || 60,
      total_questions: parseInt(tsQuestions) || 0,
    });
    if (error) return toast.error(error.message);
    toast.success("Test series added!");
    setTsTitle(""); setTsDesc(""); setTsDuration("60"); setTsQuestions("0");
    fetchData();
  };

  const deleteTestSeries = async (id: string) => {
    const { error } = await supabase.from("test_series").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Test series deleted!");
    fetchData();
  };

  const filteredTs = selectedCourse
    ? testSeries.filter((ts) => ts.course_id === selectedCourse)
    : testSeries;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-8 font-display text-4xl font-bold text-gradient">Admin Panel</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Manage Courses */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <BookOpen className="h-5 w-5 text-primary" /> Manage Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="e.g. CA Final" />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} placeholder="Optional description" />
                </div>
                <div className="space-y-1">
                  <Label>Icon</Label>
                  <Select value={courseIcon} onValueChange={setCourseIcon}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BookOpen">Book</SelectItem>
                      <SelectItem value="Trophy">Trophy</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="GraduationCap">Graduation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addCourse} className="w-full gap-2">
                  <Plus className="h-4 w-4" /> Add Course
                </Button>
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Existing Courses</h4>
                {courses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-medium">{c.title}</span>
                    <Button variant="ghost" size="icon" onClick={() => deleteCourse(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manage Test Series */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display">Manage Test Series</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input value={tsTitle} onChange={(e) => setTsTitle(e.target.value)} placeholder="e.g. Mock Test 1" />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea value={tsDesc} onChange={(e) => setTsDesc(e.target.value)} placeholder="Optional description" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Duration (min)</Label>
                    <Input type="number" value={tsDuration} onChange={(e) => setTsDuration(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Total Questions</Label>
                    <Input type="number" value={tsQuestions} onChange={(e) => setTsQuestions(e.target.value)} />
                  </div>
                </div>
                <Button onClick={addTestSeries} className="w-full gap-2">
                  <Plus className="h-4 w-4" /> Add Test Series
                </Button>
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Existing Test Series</h4>
                {filteredTs.map((ts) => (
                  <div key={ts.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <span className="font-medium">{ts.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{ts.duration_minutes}min · {ts.total_questions}Q</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTestSeries(ts.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {filteredTs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No test series yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
