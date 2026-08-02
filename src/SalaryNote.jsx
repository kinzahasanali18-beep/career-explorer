// Shared disclaimer shown near every salary-range display. Salary figures in
// this app are national-average estimates, not exact or location-adjusted, so
// this caption sits just under the number app-wide (career cards, the career
// detail page, and Sparq Mode cards). Styled small/muted/italic so it never
// competes visually with the salary itself.

export const SALARY_ESTIMATE_NOTE =
  "Estimated national average — actual pay varies by location and company.";

export default function SalaryNote({ style }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontStyle: "italic",
        fontWeight: 400,
        color: "var(--textMid)",
        lineHeight: 1.4,
        marginTop: 2,
        ...style,
      }}
    >
      {SALARY_ESTIMATE_NOTE}
    </div>
  );
}
