/**
 * Parse the auditable Markdown checklist questions attached to a mapping
 * document's `## Notes / open questions` section.
 *
 * The checklist stays ordinary GitHub Markdown while the fixed metadata lines
 * make it safe for reports and CI to consume without inventing question IDs.
 */

export class MappingQuestionParseError extends Error {}

export interface MappingQuestion {
  /** Optional source-side property path, such as `security_id` or `terms[].ratio`. */
  property: string | null;
  question: string;
  askedBy: string;
  answer: string;
  /** `null` is the explicit not-yet-answered marker for an open question. */
  answeredBy: string | null;
  answered: boolean;
  /** One-based Markdown line number, useful for precise validation/report links. */
  line: number;
}

const METADATA_LABELS = ["asked by", "answer", "answered by"] as const;
type MetadataLabel = typeof METADATA_LABELS[number];

const PLACEHOLDER_VALUES = new Set([
  "",
  "-",
  "—",
  "pending",
  "tbd",
  "n/a",
  "na",
  "unanswered",
  "not answered",
]);

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_VALUES.has(value.trim().toLowerCase());
}

/** Accept dotted source paths and JSON-pointer-like `/a/b` paths. */
export function isValidQuestionPropertyPath(value: string): boolean {
  if (value.startsWith("/")) {
    return value
      .split("/")
      .slice(1)
      .every((segment) => /^(?:[^/~]|~0|~1)+$/.test(segment));
  }
  return value.split(".").every((segment) => /^[A-Za-z_][A-Za-z0-9_-]*(?:\[\])?$/.test(segment));
}

/** Return the top-level source property represented by a question path. */
export function questionPropertyRoot(value: string): string {
  if (value.startsWith("/")) {
    return (value.split("/")[1] ?? "").replaceAll("~1", "/").replaceAll("~0", "~");
  }
  return (value.split(".")[0] ?? "").replace(/\[\]$/, "");
}

function parseQuestionHeader(
  rest: string,
  line: number
): {
  property: string | null;
  question: string;
} {
  const propertyMatch = rest.match(/^`([^`]+)`\s*:\s*(.+)$/u);
  if (propertyMatch) {
    const property = propertyMatch[1]!.trim();
    const question = propertyMatch[2]!.trim();
    if (!property || !question) {
      throw new MappingQuestionParseError(
        `line ${line}: question property and question text must both be non-empty`
      );
    }
    if (!isValidQuestionPropertyPath(property)) {
      throw new MappingQuestionParseError(
        `line ${line}: invalid question property path "${property}"`
      );
    }
    return { property, question };
  }

  if (rest.trim() === "") {
    throw new MappingQuestionParseError(`line ${line}: question text must be non-empty`);
  }
  return { property: null, question: rest.trim() };
}

function metadataLabel(value: string): MetadataLabel | null {
  const normalized = value.trim().toLowerCase();
  return (METADATA_LABELS as readonly string[]).includes(normalized)
    ? (normalized as MetadataLabel)
    : null;
}

function requireMetadata(
  metadata: Partial<Record<MetadataLabel, string>>,
  line: number
): Record<MetadataLabel, string> {
  for (const label of METADATA_LABELS) {
    const value = metadata[label];
    if (value === undefined || value.trim() === "") {
      throw new MappingQuestionParseError(
        `line ${line}: question metadata requires "${label.replace(/^./, (c) =>
          c.toUpperCase()
        )}: ..."`
      );
    }
  }
  return metadata as Record<MetadataLabel, string>;
}

/** Parse all checklist questions in the notes section. */
export function parseMappingQuestions(markdown: string): MappingQuestion[] {
  const lines = markdown.split(/\r?\n/u);
  const notesHeading = lines.findIndex((line) => line.trim() === "## Notes / open questions");
  if (notesHeading === -1) return [];

  let sectionEnd = lines.length;
  for (let i = notesHeading + 1; i < lines.length; i++) {
    if ((lines[i] ?? "").startsWith("## ")) {
      sectionEnd = i;
      break;
    }
  }

  const questions: MappingQuestion[] = [];
  let inFence = false;
  for (let i = notesHeading + 1; i < sectionEnd; i++) {
    const line = lines[i] ?? "";
    if (line.trim().startsWith("```") || line.trim().startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const task = line.match(/^-\s+\[([ xX])\]\s*(.*)$/u);
    if (!task) continue;

    const lineNumber = i + 1;
    const answered = task[1]!.toLowerCase() === "x";
    const header = parseQuestionHeader(task[2] ?? "", lineNumber);
    const metadata: Partial<Record<MetadataLabel, string>> = {};
    let j = i + 1;
    while (j < sectionEnd) {
      const next = lines[j] ?? "";
      if (/^-\s+\[([ xX])\]/u.test(next)) break;
      if (next.trim() === "") {
        j++;
        continue;
      }

      const metadataMatch = next.match(/^\s{2,}-\s+([^:]+):\s*(.*)$/u);
      if (!metadataMatch) break;
      const label = metadataLabel(metadataMatch[1] ?? "");
      if (!label) {
        throw new MappingQuestionParseError(
          `line ${j + 1}: question metadata must use Asked by, Answer, or Answered by`
        );
      }
      if (label in metadata) {
        throw new MappingQuestionParseError(
          `line ${j + 1}: duplicate question metadata "${label}"`
        );
      }
      const value = (metadataMatch[2] ?? "").trim();
      if (!value) {
        throw new MappingQuestionParseError(
          `line ${j + 1}: question metadata "${label}" must be non-empty`
        );
      }
      metadata[label] = value;
      j++;
    }

    const complete = requireMetadata(metadata, lineNumber);
    if (isPlaceholder(complete["asked by"])) {
      throw new MappingQuestionParseError(
        `line ${lineNumber}: Asked by must name a person or handle`
      );
    }
    if (isPlaceholder(complete.answer)) {
      throw new MappingQuestionParseError(
        `line ${lineNumber}: Answer must contain an answer or provisional answer`
      );
    }

    const answeredBy = isPlaceholder(complete["answered by"]) ? null : complete["answered by"];
    if (answered && answeredBy === null) {
      throw new MappingQuestionParseError(
        `line ${lineNumber}: a checked question requires a non-placeholder Answered by value`
      );
    }

    questions.push({
      ...header,
      askedBy: complete["asked by"],
      answer: complete.answer,
      answeredBy,
      answered,
      line: lineNumber,
    });
    i = j - 1;
  }

  return questions;
}
