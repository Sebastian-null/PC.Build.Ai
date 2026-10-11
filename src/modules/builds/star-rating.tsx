import { rateBuild } from "./rating-actions";
export function StarRating({
  buildId,
  topicId,
  locale,
  value,
  average,
  count,
}: {
  buildId: string;
  topicId: string;
  locale: "uk" | "en";
  value: number;
  average: number;
  count: number;
}) {
  return (
    <div className="rating-panel">
      <div>
        <strong>{average.toFixed(1)} ★</strong>
        <span>{count}</span>
      </div>
      <form action={rateBuild}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            name="rating"
            value={star}
            className={star <= value ? "active" : ""}
            aria-label={`${star}/5`}
          >
            ★
          </button>
        ))}
        <input type="hidden" name="buildId" value={buildId} />
        <input type="hidden" name="topicId" value={topicId} />
        <input type="hidden" name="locale" value={locale} />
      </form>
    </div>
  );
}
