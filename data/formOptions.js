/**
 * Central source for the selectable options used in the teacher form.
 * Editing this file changes the choices offered on Page 1 (subjects,
 * grade levels) and Page 4 (time required) without touching any other
 * file.
 */
const SUBJECT_OPTIONS = [
  "English / Language Arts",
  "Mathematics",
  "Science",
  "Social Studies",
  "Art",
  "Music",
  "Technology",
  "Design / Making",
  "Physical Education",
  "World Languages",
  "Interdisciplinary",
  "Other",
];

const GRADE_OPTIONS = [
  "Pre-K",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
];

const LESSON_STATUS_OPTIONS = [
  { value: "new", label: "New lesson/project" },
  { value: "modified", label: "Modified lesson/project" },
  { value: "existing", label: "Existing lesson/project" },
];

const TIME_OPTIONS = [
  "Under 30 minutes",
  "30–60 minutes",
  "1–2 lessons",
  "3–5 lessons",
  "Multi-week project",
  "Ongoing / recurring",
  "Other",
];
