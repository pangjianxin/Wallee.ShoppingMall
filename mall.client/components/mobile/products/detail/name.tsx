import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ProductName({ name }: { name: string }) {
  const textRef = React.useRef<HTMLSpanElement | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);

  const measure = React.useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    if (expanded) {
      setOverflowing(true);
      return;
    }
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [expanded]);

  React.useEffect(() => {
    measure();
  }, [measure, name]);

  React.useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div className="mb-2">
      <span
        ref={textRef}
        className={[
          "text-base font-semibold leading-relaxed text-foreground",
          "wrap-break-word",
          expanded ? "" : "line-clamp-2",
        ].join(" ")}
      >
        {name}
      </span>

      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          aria-expanded={expanded}
        >
          {expanded ? "收起" : "展开"}
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
