// ─── OCF types we $ref ───────────────────────────────────────
// From types/Date.schema.json: ISO 8601 YYYY-MM-DD
type OCFDate = string;

// From enums/PeriodType.schema.json
type PeriodType = "DAYS" | "MONTHS" | "YEARS";

interface VestingSchedule {
  template_id: string; // refs a VestingScheduleTemplate
  start_date: OCFDate;
}

interface VestingScheduleTemplate {
  id: string;
  statements: VestingStatement[]; // chained implicitly by order
}

interface VestingStatement {
  order: number; // 1-based sequence position
  occurrences: number; // integer >= 1; number of vesting events in segment
  period: number; // integer >= 0; length of one installment, in period_type units
  period_type: PeriodType;
  cliff?: Cliff;
  percentage: Fraction; // share of total grant this vesting statement covers
}

interface Fraction {
  numerator: number; // integer
  denominator: number; // integer >= 1
}

interface Cliff {
  occurrence: number; // 1-indexed installment at which the cliff applies (must be <= containing statement's occurrences)
  percentage: Fraction; // share of the PERIOD that vests at cliff
}
