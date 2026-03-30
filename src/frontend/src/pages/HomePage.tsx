import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useTheme } from "../ThemeContext";
import type { Course } from "../backend.d";
import { CourseCard } from "../components/CourseCard";
import { RegistrationModal } from "../components/RegistrationModal";
import { useAllCourses } from "../hooks/useQueries";

const PLACEHOLDER_SET1: Course[] = [
  {
    id: 1n,
    name: "Toy Design",
    faculty: "Ali Asgar",
    description:
      "Explore form, function, and playfulness in this intensive toy design workshop. Learn material selection, prototyping, and narrative-driven product design.",
    setId: 1n,
    dateRange: "April 28 – May 8",
    maxSeats: 19n,
    registeredCount: 0n,
  },
  {
    id: 2n,
    name: "Basics of VFX",
    faculty: "Arjun",
    description:
      "An introduction to visual effects fundamentals — compositing, motion tracking, and digital environment creation using industry-standard tools.",
    setId: 1n,
    dateRange: "April 28 – May 8",
    maxSeats: 19n,
    registeredCount: 0n,
  },
  {
    id: 3n,
    name: "Ceramic Design",
    faculty: "Abhishek Tiwari",
    description:
      "Discover the ancient craft of ceramics through a contemporary design lens. Hand-building, wheel throwing, and surface decoration techniques.",
    setId: 1n,
    dateRange: "April 28 – May 8",
    maxSeats: 19n,
    registeredCount: 0n,
  },
  {
    id: 4n,
    name: "Illustration Techniques",
    faculty: "Roney Devassia",
    description:
      "Master traditional and digital illustration methods. From gestural drawing to editorial illustration — develop a unique visual voice.",
    setId: 1n,
    dateRange: "April 28 – May 8",
    maxSeats: 19n,
    registeredCount: 0n,
  },
];

const PLACEHOLDER_SET2: Course[] = [
  {
    id: 5n,
    name: "Craft Design",
    faculty: "Bavith Balakrishnan",
    description:
      "Explore artisanal craft as a design discipline. Material exploration, weaving, leather, and handmade object-making in a studio environment.",
    setId: 2n,
    dateRange: "May 11 – May 22",
    maxSeats: 19n,
    registeredCount: 0n,
  },
  {
    id: 6n,
    name: "Advance Photography",
    faculty: "Jagath Narayanan",
    description:
      "Beyond the snapshot — lighting theory, studio techniques, editorial direction, and post-production refinement at an advanced level.",
    setId: 2n,
    dateRange: "May 11 – May 22",
    maxSeats: 19n,
    registeredCount: 0n,
  },
  {
    id: 7n,
    name: "Icon Design",
    faculty: "Rishita",
    description:
      "Craft precise, scalable, and expressive iconographic systems. Grid systems, visual weight, metaphor, and cross-platform consistency.",
    setId: 2n,
    dateRange: "May 11 – May 22",
    maxSeats: 19n,
    registeredCount: 0n,
  },
  {
    id: 8n,
    name: "Paper Making",
    faculty: "Hashim",
    description:
      "The ancient art of paper-making reimagined for contemporary practice. Texture, pulp experimentation, and hand-pressed sheet creation.",
    setId: 2n,
    dateRange: "May 11 – May 22",
    maxSeats: 19n,
    registeredCount: 0n,
  },
];

export function HomePage() {
  const { data: allCourses = [], isLoading } = useAllCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isDark } = useTheme();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const set1 = allCourses.filter(
    (c) =>
      Number(c.setId) === 1 && Number(c.registeredCount) < Number(c.maxSeats),
  );
  const set2 = allCourses.filter(
    (c) =>
      Number(c.setId) === 2 && Number(c.registeredCount) < Number(c.maxSeats),
  );

  const displaySet1 = isLoading ? PLACEHOLDER_SET1 : set1;
  const displaySet2 = isLoading ? PLACEHOLDER_SET2 : set2;

  const handleRegister = (course: Course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const bgColor = isDark ? "oklch(0.1 0.004 285)" : "oklch(0.98 0.003 85)";
  const headingColor = isDark
    ? "oklch(0.95 0.005 285)"
    : "oklch(0.12 0.005 285)";
  const goldColor = isDark ? "oklch(0.82 0.09 85)" : "oklch(0.52 0.12 75)";
  const mutedText = isDark ? "oklch(0.5 0.01 285)" : "oklch(0.45 0.01 285)";
  const dividerColor = isDark ? "oklch(0.18 0.008 285)" : "oklch(0.82 0.01 85)";
  const sectionTitleColor = isDark
    ? "oklch(0.93 0.005 285)"
    : "oklch(0.15 0.005 285)";

  const heroOverlay = isDark
    ? "linear-gradient(to top, oklch(0.1 0.004 285) 35%, oklch(0.1 0.004 285 / 0.65) 65%, oklch(0.1 0.004 285 / 0.25) 100%)"
    : "linear-gradient(to top, oklch(0.98 0.003 85 / 0.92) 30%, oklch(0.98 0.003 85 / 0.55) 65%, oklch(0.98 0.003 85 / 0.15) 100%)";

  return (
    <>
      <main style={{ background: bgColor, transition: "background 0.3s ease" }}>
        {/* Hero with parallax */}
        <section
          ref={heroRef}
          className="relative min-h-[72vh] flex flex-col justify-end overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-kmct.dim_1600x600.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              y: bgY,
              scale: 1.15,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: heroOverlay,
              transition: "background 0.3s ease",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-20">
            <motion.h1
              className="font-display font-bold leading-none"
              style={{
                fontSize: "clamp(2.4rem, 7.5vw, 6.5rem)",
                color: headingColor,
                letterSpacing: "-0.02em",
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
            >
              Summer Course
            </motion.h1>
          </div>
        </section>

        {/* Set 1 */}
        <section
          className="max-w-5xl mx-auto px-6 py-20"
          data-ocid="set1.section"
        >
          <SectionHeader
            label="Set I"
            title="COMMON COURSE"
            subtitle="APRIL 28 · MAY 8"
            isDark={isDark}
            titleColor={sectionTitleColor}
            goldColor={goldColor}
            mutedColor={mutedText}
          />

          {displaySet1.length > 0 && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-ocid="set1.list"
            >
              {displaySet1.map((course, i) => (
                <CourseCard
                  key={String(course.id)}
                  course={course}
                  index={i}
                  onRegister={handleRegister}
                  dataOcid={`set1.item.${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        <div className="max-w-5xl mx-auto px-6">
          <div
            style={{
              height: "1px",
              background: dividerColor,
              transition: "background 0.3s ease",
            }}
          />
        </div>

        {/* Set 2 */}
        <section
          className="max-w-5xl mx-auto px-6 py-20"
          data-ocid="set2.section"
        >
          <SectionHeader
            label="Set II"
            title="COMMON COURSE"
            subtitle="MAY 11 · MAY 22"
            isDark={isDark}
            titleColor={sectionTitleColor}
            goldColor={goldColor}
            mutedColor={mutedText}
          />

          {displaySet2.length > 0 && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-ocid="set2.list"
            >
              {displaySet2.map((course, i) => (
                <CourseCard
                  key={String(course.id)}
                  course={course}
                  index={i}
                  onRegister={handleRegister}
                  dataOcid={`set2.item.${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <RegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedCourse={selectedCourse}
      />
    </>
  );
}

function SectionHeader({
  label,
  title,
  subtitle,
  isDark,
  titleColor,
  goldColor,
  mutedColor,
}: {
  label: string;
  title: string;
  subtitle: string;
  isDark: boolean;
  titleColor: string;
  goldColor: string;
  mutedColor: string;
}) {
  const dividerLineColor = isDark
    ? "oklch(0.22 0.01 85 / 0.35)"
    : "oklch(0.65 0.06 85 / 0.4)";

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-4 mb-3">
        <span
          className="text-xs tracking-widest uppercase font-mono"
          style={{ color: goldColor }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: dividerLineColor,
          }}
        />
      </div>
      <h2
        className="font-display text-3xl font-bold tracking-wide"
        style={{ color: titleColor }}
      >
        {title}
      </h2>
      <p className="text-sm tracking-widest mt-1" style={{ color: mutedColor }}>
        {subtitle}
      </p>
    </motion.div>
  );
}
