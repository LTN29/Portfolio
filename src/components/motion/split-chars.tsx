/**
 * Splits text into word > char spans for per-letter animation.
 * Screen readers get the full sentence once via aria-label; the spans are hidden from them.
 * Uses Intl.Segmenter when available so Vietnamese diacritics stay attached to their letter.
 */
function graphemes(word: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("vi", { granularity: "grapheme" });
    return Array.from(segmenter.segment(word), (part) => part.segment);
  }
  return Array.from(word);
}

export function SplitChars({ text, className = "", charClassName = "char" }: { text: string; className?: string; charClassName?: string }) {
  const words = text.normalize("NFC").split(" ");
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, wi) => (
        <span className="split-word" aria-hidden="true" key={`${word}-${wi}`}>
          {graphemes(word).map((char, ci) => (
            <span className={charClassName} key={ci}>{char}</span>
          ))}
          {wi < words.length - 1 && <span className={`${charClassName} split-space`}>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
