import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Course } from "../backend.d";
import { getBackend } from "../backendClient";
import { useAllCourses } from "../hooks/useQueries";

const KMCT_DOMAIN = "@kmctdesign.org";

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedCourse: Course | null;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="block text-xs tracking-widest uppercase mb-1.5"
      style={{ color: "oklch(0.5 0.01 285)" }}
    >
      {children}
    </p>
  );
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`admin-input ${props.className ?? ""}`} />
  );
}

export function RegistrationModal({ open, onClose, preselectedCourse }: Props) {
  const queryClient = useQueryClient();
  const { data: allCourses = [] } = useAllCourses();

  const set1Courses = allCourses.filter(
    (c) =>
      Number(c.setId) === 1 && Number(c.registeredCount) < Number(c.maxSeats),
  );
  const set2Courses = allCourses.filter(
    (c) =>
      Number(c.setId) === 2 && Number(c.registeredCount) < Number(c.maxSeats),
  );

  const preSet1 =
    preselectedCourse && Number(preselectedCourse.setId) === 1
      ? String(preselectedCourse.id)
      : set1Courses[0]
        ? String(set1Courses[0].id)
        : "";
  const preSet2 =
    preselectedCourse && Number(preselectedCourse.setId) === 2
      ? String(preselectedCourse.id)
      : set2Courses[0]
        ? String(set2Courses[0].id)
        : "";

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [set1Id, setSet1Id] = useState(preSet1);
  const [set2Id, setSet2Id] = useState(preSet2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) return "";
    if (!val.toLowerCase().endsWith(KMCT_DOMAIN)) {
      return `Only KMCT college email addresses are allowed (${KMCT_DOMAIN})`;
    }
    return "";
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailError(validateEmail(val));
  };

  const reset = () => {
    setName("");
    setRoll("");
    setEmail("");
    setEmailError("");
    setSet1Id(preSet1);
    setSet2Id(preSet2);
    setError("");
    setSuccess(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      reset();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !roll.trim() || !email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    if (!set1Id || !set2Id) {
      setError("Please select one course from each set.");
      return;
    }

    setLoading(true);
    try {
      const actor = await getBackend();
      const result = await actor.registerStudent(
        roll.trim(),
        name.trim(),
        email.trim(),
        BigInt(set1Id),
        BigInt(set2Id),
      );

      // Empty string or contains "success" = OK
      if (result === "" || result.toLowerCase().includes("success")) {
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      } else {
        setError(result);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="registration.dialog"
        className="max-w-lg p-0 border-0 shadow-none bg-transparent"
        style={{
          background: "oklch(0.11 0.005 285)",
          border: "1px solid oklch(0.24 0.01 85 / 0.45)",
          borderRadius: 0,
        }}
      >
        <div
          className="px-8 py-5"
          style={{ borderBottom: "1px solid oklch(0.2 0.008 285)" }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-display text-2xl tracking-wider"
              style={{ color: "oklch(0.82 0.09 85)" }}
            >
              ENROL NOW
            </DialogTitle>
            {preselectedCourse && (
              <p
                className="text-sm mt-1"
                style={{ color: "oklch(0.52 0.01 285)" }}
              >
                {preselectedCourse.name}
              </p>
            )}
          </DialogHeader>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-8 py-14 flex flex-col items-center gap-4 text-center"
              data-ocid="registration.success_state"
            >
              <CheckCircle2
                className="w-12 h-12"
                style={{ color: "oklch(0.82 0.09 85)" }}
              />
              <h3
                className="font-display text-xl"
                style={{ color: "oklch(0.93 0.005 285)" }}
              >
                Registration Confirmed
              </h3>
              <p className="text-sm" style={{ color: "oklch(0.52 0.01 285)" }}>
                You have been successfully enrolled. Welcome to KMCT School of
                Design.
              </p>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-4 register-btn"
                data-ocid="registration.close_button"
              >
                CLOSE
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="px-8 py-7 flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Name */}
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <FieldInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  data-ocid="registration.input"
                />
              </div>

              {/* Roll Number */}
              <div>
                <FieldLabel>Roll Number</FieldLabel>
                <FieldInput
                  type="text"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="e.g. KD2024001"
                  data-ocid="registration.input"
                />
              </div>

              {/* Email */}
              <div>
                <FieldLabel>College Email</FieldLabel>
                <FieldInput
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder={`student${KMCT_DOMAIN}`}
                  style={{
                    borderColor: emailError
                      ? "oklch(0.6 0.2 27 / 0.7)"
                      : undefined,
                  }}
                  data-ocid="registration.input"
                />
                {emailError && (
                  <p
                    className="mt-1.5 text-xs flex items-start gap-1.5"
                    style={{ color: "oklch(0.65 0.18 27)" }}
                    data-ocid="registration.error_state"
                  >
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Set 1 */}
              <div>
                <FieldLabel>Set I — Apr 28 · May 8</FieldLabel>
                <div className="flex flex-col gap-2 mt-1">
                  {set1Courses.map((c) => (
                    <label
                      key={String(c.id)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="set1"
                        value={String(c.id)}
                        checked={set1Id === String(c.id)}
                        onChange={(e) => setSet1Id(e.target.value)}
                        data-ocid="registration.radio"
                      />
                      <span
                        className="text-sm"
                        style={{
                          color:
                            set1Id === String(c.id)
                              ? "oklch(0.82 0.09 85)"
                              : "oklch(0.62 0.008 285)",
                        }}
                      >
                        {c.name}
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "oklch(0.42 0.008 285)" }}
                        >
                          — {c.faculty}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Set 2 */}
              <div>
                <FieldLabel>Set II — May 11 · May 22</FieldLabel>
                <div className="flex flex-col gap-2 mt-1">
                  {set2Courses.map((c) => (
                    <label
                      key={String(c.id)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="set2"
                        value={String(c.id)}
                        checked={set2Id === String(c.id)}
                        onChange={(e) => setSet2Id(e.target.value)}
                        data-ocid="registration.radio"
                      />
                      <span
                        className="text-sm"
                        style={{
                          color:
                            set2Id === String(c.id)
                              ? "oklch(0.82 0.09 85)"
                              : "oklch(0.62 0.008 285)",
                        }}
                      >
                        {c.name}
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "oklch(0.42 0.008 285)" }}
                        >
                          — {c.faculty}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* General error */}
              {error && (
                <p
                  className="text-sm flex items-start gap-2"
                  style={{ color: "oklch(0.65 0.18 27)" }}
                  data-ocid="registration.error_state"
                >
                  <X className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !!emailError}
                className="register-btn flex items-center justify-center gap-2 mt-1"
                data-ocid="registration.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  "REGISTER →"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
