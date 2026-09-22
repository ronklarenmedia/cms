import type { BlockProps } from "../contract";
import type { ComparisonContent, ComparisonSettings, ComparisonVariant } from "./schema";

export function Comparison({ variant, content }: BlockProps<ComparisonVariant, ComparisonContent, ComparisonSettings>) {
  const { eyebrow, heading, intro, columns, rows } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);

  return (
    <div className={`blk-comparison blk-comparison--${variant}`}>
      {hasHeader && (
        <header className="blk-comparison__header">
          {eyebrow && <p className="blk-comparison__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-comparison__heading">{heading}</h2>}
          {intro && <p className="blk-comparison__intro">{intro}</p>}
        </header>
      )}

      <div className="blk-comparison__scroll">
        <table className="blk-comparison__table">
          <thead>
            <tr>
              <th className="blk-comparison__corner" scope="col" />
              {columns.map((col) => (
                <th
                  key={col.name}
                  scope="col"
                  className={`blk-comparison__col-heading${col.highlighted ? " blk-comparison__col-heading--highlighted" : ""}`}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="blk-comparison__row">
                <th scope="row" className="blk-comparison__row-label">
                  {row.label}
                </th>
                {row.values.map((value, idx) => (
                  <td
                    key={`${row.label}-${idx}`}
                    className={`blk-comparison__cell${columns[idx]?.highlighted ? " blk-comparison__cell--highlighted" : ""}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
