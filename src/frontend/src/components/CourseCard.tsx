import { motion } from "motion/react";
import { useTheme } from "../ThemeContext";
import type { Course } from "../backend.d";

interface CourseCardProps {
  course: Course;
  index: number;
  onRegister: (course: Course) => void;
  dataOcid: string;
}

export function CourseCard({
  course,
  index,
  onRegister,
  dataOcid,
}: CourseCardProps) {
  const { isDark } = useTheme();
  const seatsLeft = Number(course.maxSeats) - Number(course.registeredCount);
  const isAlmostFull = seatsLeft <= 5;

  const indexColor = isDark ? "oklch(0.4 0.008 285)" : "oklch(0.55 0.01 285)";
  const nameColor = isDark ? "oklch(0.93 0.005 285)" : "oklch(0.12 0.005 285)";
  const facultyLabelColor = isDark
    ? "oklch(0.4 0.008 285)"
    : "oklch(0.5 0.01 285)";
  const facultyNameColor = isDark
    ? "oklch(0.82 0.09 85)"
    : "oklch(0.45 0.12 75)";
  const descColor = isDark ? "oklch(0.52 0.008 285)" : "oklch(0.42 0.008 285)";
  const dateColor = isDark ? "oklch(0.4 0.008 285)" : "oklch(0.52 0.01 285)";
  const dividerColor = isDark
    ? "oklch(0.22 0.01 85 / 0.25)"
    : "oklch(0.72 0.04 85 / 0.5)";
  const seatsBorder = isAlmostFull
    ? isDark
      ? "oklch(0.6 0.2 27 / 0.5)"
      : "oklch(0.55 0.18 27 / 0.6)"
    : isDark
      ? "oklch(0.82 0.09 85 / 0.28)"
      : "oklch(0.55 0.1 75 / 0.45)";
  const seatsColor = isAlmostFull
    ? isDark
      ? "oklch(0.68 0.18 30)"
      : "oklch(0.5 0.18 30)"
    : isDark
      ? "oklch(0.62 0.06 85)"
      : "oklch(0.45 0.1 75)";

  const cardBg = isDark ? "oklch(0.13 0.006 285)" : "oklch(0.94 0.006 85)";
  const cardBorder = isDark
    ? "1px solid oklch(0.2 0.01 285 / 0.6)"
    : "1px solid oklch(0.78 0.018 85)";

  return (
    <motion.article
      data-ocid={dataOcid}
      className="course-card p-7 flex flex-col gap-4"
      style={{
        background: cardBg,
        border: cardBorder,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="text-xs tracking-widest uppercase font-mono"
          style={{ color: indexColor }}
        >
          0{index + 1}
        </span>
        <span
          className="text-xs px-2 py-0.5 border"
          style={{
            borderColor: seatsBorder,
            color: seatsColor,
          }}
        >
          {seatsLeft} / {Number(course.maxSeats)} seats
        </span>
      </div>

      <h3
        className="font-display text-2xl font-bold leading-tight"
        style={{ color: nameColor }}
      >
        {course.name}
      </h3>

      <div className="flex items-center gap-3">
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: facultyLabelColor }}
        >
          Faculty
        </span>
        <span
          style={{
            color: facultyNameColor,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {course.faculty}
        </span>
      </div>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: descColor }}
      >
        {course.description ||
          "An immersive design workshop exploring creative methodologies, hands-on techniques, and professional practice under expert faculty guidance."}
      </p>

      {course.dateRange && (
        <p className="text-xs tracking-wider" style={{ color: dateColor }}>
          {course.dateRange}
        </p>
      )}

      <div style={{ borderTop: `1px solid ${dividerColor}` }} />

      <button
        type="button"
        onClick={() => onRegister(course)}
        className="register-btn w-full"
        data-ocid={`${dataOcid.replace(/\.item\.\d+$/, "")}.primary_button`}
      >
        REGISTER
      </button>
    </motion.article>
  );
}
