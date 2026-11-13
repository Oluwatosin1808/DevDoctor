const SYMBOL = { pass: "\u2713", warn: "\u26a0", error: "\u2717" };
const TONE = { pass: "green", warn: "yellow", error: "red" };

/** Human-readable terminal report. */
export function formatHuman(result, { paint }) {
  const lines = [];
  const rule = "\u2500".repeat(56);

  lines.push(paint("bold", "cDoc"));
  lines.push(paint("dim", `Scanning ${result.root}`));
  lines.push("");

  for (const category of result.categories) {
    lines.push(paint("bold", category.title));

    for (const finding of category.findings) {
      const mark = paint(TONE[finding.status], SYMBOL[finding.status]);
      lines.push(`    ${mark} ${finding.message}`);
    }

    lines.push("");
  }

  lines.push(paint("dim", rule));

  const summary =
    result.attention > 0
      ? `${result.attention} finding(s) need attention`
      : "no findings need attention";

  lines.push(
    `${paint("bold", `Score ${result.score}/100`)} \u2014 ${summary}`,
  );
  lines.push(
    paint(
      "dim",
      `${result.totals.pass} passed \u00b7 ${result.totals.warn} warnings \u00b7 ${result.totals.error} errors`,
    ),
  );

  return lines.join("\n");
}

/** Machine-readable report for `--json`. */
export function formatJson(result) {
  return JSON.stringify(result, null, 2);
}
