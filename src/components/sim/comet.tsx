/* Vệt sáng chạy dọc một đường (path có pathLength = 100). Kiểu dáng ở .comet trong site.css. */
export function Comet({ d, dur, delay, once = false }: { d: string; dur?: number; delay?: number; once?: boolean }) {
  const style = { ["--dur" as string]: dur ? `${dur}s` : undefined, ["--delay" as string]: delay ? `${delay}s` : undefined };
  const cls = once ? " comet--once" : "";
  return (
    <g aria-hidden="true" style={style}>
      <path d={d} pathLength={100} className={`comet comet--tail${cls}`} />
      <path d={d} pathLength={100} className={`comet comet--body${cls}`} />
      <path d={d} pathLength={100} className={`comet comet--glow${cls}`} />
      <path d={d} pathLength={100} className={`comet comet--head${cls}`} />
    </g>
  );
}
