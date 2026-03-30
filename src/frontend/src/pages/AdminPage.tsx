import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Course, StudentRegistration } from "../backend.d";
import { getBackend } from "../backendClient";
import { useAllCourses } from "../hooks/useQueries";

// ── Shared primitives ─────────────────────────────────────────────────────────

function AdminLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="block text-xs tracking-widest uppercase mb-1.5"
      style={{ color: "oklch(0.5 0.01 285)" }}
    >
      {children}
    </p>
  );
}

function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`admin-input ${props.className ?? ""}`} />
  );
}

function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      rows={3}
      className={`admin-input resize-none ${props.className ?? ""}`}
    />
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw) return;
    setLoading(true);
    setError("");
    try {
      const ok = await (await getBackend()).verifyAdminPassword(pw);
      if (ok) {
        onLogin(pw);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm flex flex-col gap-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <ShieldCheck
            className="w-8 h-8"
            style={{ color: "oklch(0.82 0.09 85)" }}
          />
          <div>
            <h1
              className="font-display text-3xl font-bold"
              style={{ color: "oklch(0.93 0.005 285)" }}
            >
              ADMIN ACCESS
            </h1>
            <p
              className="text-sm mt-2"
              style={{ color: "oklch(0.5 0.01 285)" }}
            >
              KMCT School of Design
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <AdminLabel>Password</AdminLabel>
            <div className="relative">
              <AdminInput
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                data-ocid="admin.input"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "oklch(0.5 0.01 285)" }}
                data-ocid="admin.toggle"
              >
                {show ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-xs flex items-center gap-2"
              style={{ color: "oklch(0.65 0.18 27)" }}
              data-ocid="admin.error_state"
            >
              <X className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pw}
            className="register-btn flex items-center justify-center gap-2"
            data-ocid="admin.primary_button"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> VERIFYING...
              </>
            ) : (
              "LOGIN →"
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}

// ── Registrations Tab ─────────────────────────────────────────────────────────

function RegistrationsTab({
  password,
  courses,
}: {
  password: string;
  courses: Course[];
}) {
  const [regs, setRegs] = useState<StudentRegistration[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearMsg, setClearMsg] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await (await getBackend()).getAllRegistrations(password);
      setRegs(data);
    } catch {
      setError("Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to CLEAR ALL REGISTRATIONS? This cannot be undone.",
    );
    if (!confirmed) return;
    setClearing(true);
    setClearMsg("");
    try {
      const ok = await (await getBackend()).clearAllRegistrations(password);
      if (ok) {
        setRegs(null);
        setClearMsg("All registrations cleared successfully.");
        setTimeout(() => setClearMsg(""), 4000);
      } else {
        setError("Failed to clear registrations. Check your password.");
      }
    } catch {
      setError("Connection error while clearing.");
    } finally {
      setClearing(false);
    }
  };

  const getCourseName = (id: bigint) =>
    courses.find((c) => c.id === id)?.name ?? String(id);

  if (!regs) {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        {loading ? (
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "oklch(0.82 0.09 85)" }}
            data-ocid="admin.loading_state"
          />
        ) : (
          <>
            {error && (
              <p
                className="text-sm"
                style={{ color: "oklch(0.65 0.18 27)" }}
                data-ocid="admin.error_state"
              >
                {error}
              </p>
            )}
            <AnimatePresence>
              {clearMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm flex items-center gap-2"
                  style={{ color: "oklch(0.72 0.14 145)" }}
                  data-ocid="admin.success_state"
                >
                  <CheckCircle2 className="w-4 h-4" /> {clearMsg}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                type="button"
                onClick={load}
                className="register-btn"
                data-ocid="admin.primary_button"
              >
                LOAD REGISTRATIONS
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={clearing}
                className="register-btn flex items-center gap-2"
                style={{
                  borderColor: "oklch(0.65 0.18 27 / 0.6)",
                  color: "oklch(0.65 0.18 27)",
                }}
                data-ocid="admin.delete_button"
              >
                {clearing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> CLEARING...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> CLEAR ALL REGISTRATIONS
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (regs.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div
          className="text-center py-12"
          style={{ color: "oklch(0.42 0.008 285)" }}
          data-ocid="admin.empty_state"
        >
          <p className="font-display text-lg">No registrations yet.</p>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={clearAll}
            disabled={clearing}
            className="register-btn flex items-center gap-2"
            style={{
              borderColor: "oklch(0.65 0.18 27 / 0.6)",
              color: "oklch(0.65 0.18 27)",
            }}
            data-ocid="admin.delete_button"
          >
            {clearing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> CLEARING...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" /> CLEAR ALL REGISTRATIONS
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={clearAll}
          disabled={clearing}
          className="register-btn flex items-center gap-2 text-xs"
          style={{
            borderColor: "oklch(0.65 0.18 27 / 0.6)",
            color: "oklch(0.65 0.18 27)",
          }}
          data-ocid="admin.delete_button"
        >
          {clearing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> CLEARING...
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" /> CLEAR ALL REGISTRATIONS
            </>
          )}
        </button>
      </div>
      <div
        className="border"
        style={{ borderColor: "oklch(0.22 0.01 85 / 0.35)" }}
        data-ocid="admin.table"
      >
        <Table>
          <TableHeader>
            <TableRow
              style={{ borderBottomColor: "oklch(0.22 0.01 85 / 0.35)" }}
            >
              {[
                "#",
                "Name",
                "Roll Number",
                "Email",
                "Set I Course",
                "Set II Course",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "oklch(0.82 0.09 85)" }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {regs.map((reg, i) => (
              <TableRow
                key={reg.studentId}
                data-ocid={`admin.item.${i + 1}`}
                style={{ borderBottomColor: "oklch(0.22 0.01 85 / 0.15)" }}
              >
                <TableCell
                  className="text-xs font-mono"
                  style={{ color: "oklch(0.4 0.008 285)" }}
                >
                  {i + 1}
                </TableCell>
                <TableCell style={{ color: "oklch(0.85 0.005 285)" }}>
                  {reg.name}
                </TableCell>
                <TableCell
                  className="font-mono text-sm"
                  style={{ color: "oklch(0.62 0.008 285)" }}
                >
                  {reg.studentId}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: "oklch(0.62 0.008 285)" }}
                >
                  {reg.email}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: "oklch(0.72 0.06 85)" }}
                >
                  {getCourseName(reg.courseSet1Id)}
                </TableCell>
                <TableCell
                  className="text-sm"
                  style={{ color: "oklch(0.72 0.06 85)" }}
                >
                  {getCourseName(reg.courseSet2Id)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Edit Course Card ──────────────────────────────────────────────────────────

function EditCourseCard({
  course,
  password,
  index,
}: {
  course: Course;
  password: string;
  index: number;
}) {
  const [name, setName] = useState(course.name);
  const [faculty, setFaculty] = useState(course.faculty);
  const [description, setDescription] = useState(course.description);
  const [dateRange, setDateRange] = useState(course.dateRange);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const ok = await (await getBackend()).updateCourse(
        password,
        course.id,
        name,
        faculty,
        description,
        dateRange,
      );
      if (ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Update failed. Check your password.");
      }
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="p-6 flex flex-col gap-4"
      style={{ border: "1px solid oklch(0.22 0.01 85 / 0.25)" }}
      data-ocid={`admin.item.${index + 1}`}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-display text-base font-bold"
          style={{ color: "oklch(0.82 0.09 85)" }}
        >
          {course.name}
        </span>
        <span
          className="text-xs font-mono tracking-wider"
          style={{ color: "oklch(0.4 0.008 285)" }}
        >
          Set {Number(course.setId)} · 0{index + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <AdminLabel>Course Name</AdminLabel>
          <AdminInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-ocid="admin.input"
          />
        </div>
        <div>
          <AdminLabel>Faculty</AdminLabel>
          <AdminInput
            type="text"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            data-ocid="admin.input"
          />
        </div>
        <div>
          <AdminLabel>Date Range</AdminLabel>
          <AdminInput
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            data-ocid="admin.input"
          />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Description</AdminLabel>
          <AdminTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-ocid="admin.textarea"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="register-btn flex items-center gap-2"
          data-ocid="admin.save_button"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> SAVING...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> SAVE
            </>
          )}
        </button>

        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs flex items-center gap-1.5"
              style={{ color: "oklch(0.72 0.14 145)" }}
              data-ocid="admin.success_state"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </motion.span>
          )}
          {error && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs flex items-center gap-1.5"
              style={{ color: "oklch(0.65 0.18 27)" }}
              data-ocid="admin.error_state"
            >
              <X className="w-3.5 h-3.5" /> {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Change Password Tab ───────────────────────────────────────────────────────

function ChangePasswordTab({ password: _sessionPw }: { password: string }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!oldPw || !newPw || !confirmPw) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPw !== confirmPw) {
      setError("New passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const ok = await (await getBackend()).changeAdminPassword(oldPw, newPw);
      if (ok) {
        setSuccess("Password changed successfully.");
        setOldPw("");
        setNewPw("");
        setConfirmPw("");
        void _sessionPw;
      } else {
        setError("Old password is incorrect.");
      }
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm flex flex-col gap-4">
      <div>
        <AdminLabel>Current Password</AdminLabel>
        <AdminInput
          type="password"
          value={oldPw}
          onChange={(e) => setOldPw(e.target.value)}
          placeholder="Current password"
          data-ocid="admin.input"
        />
      </div>
      <div>
        <AdminLabel>New Password</AdminLabel>
        <AdminInput
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          placeholder="New password (min 6 chars)"
          data-ocid="admin.input"
        />
      </div>
      <div>
        <AdminLabel>Confirm New Password</AdminLabel>
        <AdminInput
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="Repeat new password"
          data-ocid="admin.input"
        />
      </div>

      {error && (
        <p
          className="text-xs flex items-center gap-2"
          style={{ color: "oklch(0.65 0.18 27)" }}
          data-ocid="admin.error_state"
        >
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}
      {success && (
        <p
          className="text-xs flex items-center gap-2"
          style={{ color: "oklch(0.72 0.14 145)" }}
          data-ocid="admin.success_state"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="register-btn flex items-center justify-center gap-2"
        data-ocid="admin.submit_button"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> UPDATING...
          </>
        ) : (
          "UPDATE PASSWORD →"
        )}
      </button>
    </form>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard({
  password,
  onLogout,
}: {
  password: string;
  onLogout: () => void;
}) {
  const { data: courses = [] } = useAllCourses();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <span
              className="text-xs tracking-widest uppercase font-mono"
              style={{ color: "oklch(0.82 0.09 85)" }}
            >
              Admin Panel
            </span>
            <div
              style={{
                height: "1px",
                width: "40px",
                background: "oklch(0.22 0.01 85 / 0.4)",
              }}
            />
          </div>
          <h1
            className="font-display text-4xl font-bold"
            style={{ color: "oklch(0.93 0.005 285)" }}
          >
            DASHBOARD
          </h1>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="register-btn flex items-center gap-2 text-xs"
          style={{
            borderColor: "oklch(0.35 0.01 285)",
            color: "oklch(0.55 0.01 285)",
          }}
          data-ocid="admin.secondary_button"
        >
          <LogOut className="w-3.5 h-3.5" /> LOGOUT
        </button>
      </div>

      <Tabs defaultValue="registrations">
        <TabsList
          className="mb-8 bg-transparent gap-1 p-0 border-b"
          style={{ borderBottomColor: "oklch(0.2 0.008 285)", borderRadius: 0 }}
        >
          {[
            { value: "registrations", label: "Registrations" },
            { value: "courses", label: "Edit Courses" },
            { value: "password", label: "Change Password" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs tracking-widest uppercase px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
              style={{ color: "oklch(0.5 0.01 285)" }}
              data-ocid="admin.tab"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="registrations">
          <RegistrationsTab password={password} courses={courses} />
        </TabsContent>

        <TabsContent value="courses">
          <div className="flex flex-col gap-4">
            {courses.length === 0 ? (
              <p style={{ color: "oklch(0.42 0.008 285)" }} className="text-sm">
                Loading courses...
              </p>
            ) : (
              courses.map((course, i) => (
                <EditCourseCard
                  key={String(course.id)}
                  course={course}
                  password={password}
                  index={i}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="password">
          <ChangePasswordTab password={password} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

// ── Admin Page (root) ─────────────────────────────────────────────────────────

export function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);

  if (!password) {
    return <LoginScreen onLogin={setPassword} />;
  }

  return (
    <AdminDashboard password={password} onLogout={() => setPassword(null)} />
  );
}
