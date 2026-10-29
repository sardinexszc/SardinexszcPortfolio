// Visits per day as a line, with red dots on days a résumé was downloaded. Server-rendered inline SVG.
// Axis labels are HTML around the SVG so they stay readable when the chart scales down on phones.
type Day = { day: string; visits: number; downloads: number };

const W = 640, H = 200, PAD = 8;
const dateLabel = (day: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));

export function TrendChart({ days }: { days: Day[] }) {
  const peak = Math.max(1, ...days.map((d) => d.visits));
  const top = peak <= 4 ? 4 : Math.ceil(peak / 4) * 4;
  const x = (i: number) => PAD + (i * (W - PAD * 2)) / Math.max(1, days.length - 1);
  const y = (v: number) => H - PAD - (v / top) * (H - PAD * 2);
  const line = days.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.visits).toFixed(1)}`).join("");
  const area = `${line}L${x(days.length - 1).toFixed(1)},${H - PAD}L${x(0).toFixed(1)},${H - PAD}Z`;
  const step = (W - PAD * 2) / Math.max(1, days.length - 1);
  const totalVisits = days.reduce((t, d) => t + d.visits, 0);
  const totalDownloads = days.reduce((t, d) => t + d.downloads, 0);
  const busiest = days.reduce((best, d) => (d.visits > best.visits ? d : best), days[0]);

  return (
    <figure className="db-trend">
      <div className="db-legend" aria-hidden="true">
        <span><i className="db-legend-line" /> New visitors</span>
        <span><i className="db-legend-dot" /> Résumé downloaded</span>
      </div>
      <div className="db-trend-plot">
        <div className="db-trend-y" aria-hidden="true">{[top, top / 2, 0].map((v) => <span key={v}>{v}</span>)}</div>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="trend-summary">
          {[0, 0.5, 1].map((f) => <line key={f} className="db-trend-grid" x1={PAD} x2={W - PAD} y1={y(top * f)} y2={y(top * f)} />)}
          <path className="db-trend-area" d={area} />
          <path className="db-trend-line" d={line} />
          {days.map((d, i) => d.downloads > 0 ? <circle key={d.day} className="db-trend-dot" cx={x(i)} cy={y(d.visits)} r={5} /> : null)}
          {days.map((d, i) => (
            <rect key={d.day} className="db-trend-hit" x={x(i) - step / 2} y={0} width={step} height={H}>
              <title>{`${dateLabel(d.day)}: ${d.visits} new visitor${d.visits === 1 ? "" : "s"}, ${d.downloads} download${d.downloads === 1 ? "" : "s"}`}</title>
            </rect>
          ))}
        </svg>
      </div>
      <div className="db-trend-x" aria-hidden="true">
        <span>{dateLabel(days[0].day)}</span><span>{dateLabel(days[Math.floor(days.length / 2)].day)}</span><span>{dateLabel(days[days.length - 1].day)}</span>
      </div>
      <figcaption id="trend-summary" className="visually-hidden">
        {totalVisits} new visitors and {totalDownloads} résumé downloads from {dateLabel(days[0].day)} to {dateLabel(days[days.length - 1].day)}.
        {busiest.visits ? ` Busiest day: ${dateLabel(busiest.day)} with ${busiest.visits}.` : ""}
      </figcaption>
      <details className="db-table-toggle">
        <summary>Show as table</summary>
        <table>
          <thead><tr><th scope="col">Day</th><th scope="col">New visitors</th><th scope="col">Downloads</th></tr></thead>
          <tbody>{[...days].reverse().map((d) => <tr key={d.day}><th scope="row">{dateLabel(d.day)}</th><td>{d.visits}</td><td>{d.downloads}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}
