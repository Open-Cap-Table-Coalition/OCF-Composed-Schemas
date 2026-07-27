import {
  MappingQuestionParseError,
  parseMappingNotes,
  parseMappingQuestions,
} from "../scripts/lib/mapping-questions.js";

function notes(body: string): string {
  return ["## Notes / open questions", "", body, ""].join("\n");
}

describe("mapping questions", () => {
  it("extracts authored notes while excluding checklist question metadata", () => {
    expect(
      parseMappingNotes(
        notes(
          [
            "- **Context.** Carta has no native transfer link.",
            "  The replacement relationship is therefore not lossless.",
            "",
            "- [ ] `security_id`: Can Carta add a predecessor link?",
            "  - Asked by: @alice",
            "  - Answer: Pending confirmation.",
            "  - Answered by: —",
          ].join("\n")
        )
      )
    ).toEqual([
      "**Context.** Carta has no native transfer link. The replacement relationship is therefore not lossless.",
    ]);
  });

  it("parses open and answered GitHub checklist items with optional property paths", () => {
    const questions = parseMappingQuestions(
      notes(
        [
          "- [ ] `terms[].ratio`: Which ratio should be used when several terms exist?",
          "  - Target: ConvertibleNote.discountPercentage",
          "  - Asked by: @alice",
          "  - Answer: Pending confirmation from the OCF owners.",
          "  - Answered by: —",
          "",
          "- [x] Should mapping-level notes be retained?",
          "  - Asked by: @alice",
          "  - Answer: Yes; the Markdown is the audit record.",
          "  - Answered by: @bob",
        ].join("\n")
      )
    );

    expect(questions).toEqual([
      {
        property: "terms[].ratio",
        target: "ConvertibleNote.discountPercentage",
        question: "Which ratio should be used when several terms exist?",
        askedBy: "@alice",
        answer: "Pending confirmation from the OCF owners.",
        answeredBy: null,
        answered: false,
        line: 3,
      },
      {
        property: null,
        target: null,
        question: "Should mapping-level notes be retained?",
        askedBy: "@alice",
        answer: "Yes; the Markdown is the audit record.",
        answeredBy: "@bob",
        answered: true,
        line: 9,
      },
    ]);
  });

  it("rejects missing metadata and placeholder answers", () => {
    expect(() =>
      parseMappingQuestions(
        notes(
          [
            "- [ ] `name`: Is this target semantically equivalent?",
            "  - Asked by: @alice",
            "  - Answer: pending",
            "  - Answered by: —",
          ].join("\n")
        )
      )
    ).toThrow(MappingQuestionParseError);
  });

  it("rejects malformed Carta target paths", () => {
    expect(() =>
      parseMappingQuestions(
        notes(
          [
            "- [ ] Is this target a possible two-hop route?",
            "  - Target: Compliance.countryOfResidency.extra",
            "  - Asked by: @alice",
            "  - Answer: Pending confirmation.",
            "  - Answered by: —",
          ].join("\n")
        )
      )
    ).toThrow(/invalid Carta target path/);
  });

  it("requires a real answerer when a question is checked", () => {
    expect(() =>
      parseMappingQuestions(
        notes(
          [
            "- [x] `name`: Is this target semantically equivalent?",
            "  - Asked by: @alice",
            "  - Answer: Yes; the meanings match.",
            "  - Answered by: —",
          ].join("\n")
        )
      )
    ).toThrow(/checked question requires/);
  });
});
