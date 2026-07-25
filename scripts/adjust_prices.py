"""
Adjust all "K"-suffixed prices in paket-tour-section.tsx by subtracting 150K.

Rules:
- Input format uses Indonesian thousand separator (period):
  - "1.050K" -> 1050 (one thousand fifty)
  - "950K"   -> 950
- Subtract 150 from the numeric value.
- Re-format with Indonesian separator (period) — no separator if < 1000.

Examples:
  1.150K -> 1.000K   (1150 - 150 = 1000)
  1.000K -> 850K     (1000 - 150 = 850)
  950K   -> 800K     (950 - 150 = 800)
  1.250K -> 1.100K   (1250 - 150 = 1100)
"""

import re
from pathlib import Path

SRC = Path("/home/z/my-project/src/components/paket-tour-section.tsx")

DECREMENT = 150


def format_id(value: int) -> str:
    """Format integer using Indonesian thousand separator (period).

    Examples:
      850  -> "850"
      1000 -> "1.000"
      1050 -> "1.050"
      1100 -> "1.100"
    """
    s = str(value)
    parts: list[str] = []
    while s:
        parts.insert(0, s[-3:])
        s = s[:-3]
    return ".".join(parts)


def replace_price(match: re.Match) -> str:
    """Regex replacement: capture (prefix)(number)K, with lookahead suffix."""
    prefix, num_str = match.group(1), match.group(2)
    # Indonesian format: strip periods, parse as int
    raw = num_str.replace(".", "")
    try:
        value = int(raw)
    except ValueError:
        return match.group(0)
    new_value = value - DECREMENT
    if new_value < 0:
        new_value = 0
    new_num_str = format_id(new_value)
    return f"{prefix}{new_num_str}K"


def main() -> None:
    text = SRC.read_text(encoding="utf-8")

    # Match a price token of form <number>K where <number> may contain
    # Indonesian thousand separators (periods). Capture prefix (e.g. '"')
    # and suffix (e.g. '"' or ' per car') to preserve surrounding context.
    # Negative lookbehind/ahead avoids touching other uses of "K".
    # Pattern: (quote-or-space)(digits-with-dots)K(not-letter-or-digit)
    pattern = re.compile(
        r'(["\s>:])(\d{1,3}(?:\.\d{3})+|\d{1,3})K(?=[\s"/,])'
    )

    new_text, count = pattern.subn(replace_price, text)

    SRC.write_text(new_text, encoding="utf-8")
    print(f"Adjusted {count} prices in {SRC}")
    print("--- Sample diff (first 6 substitutions) ---")

    # Show before/after for verification by re-running pattern on original
    orig_matches = list(pattern.finditer(text))
    for m in orig_matches[:6]:
        before = m.group(0)
        # Recompute after
        after = replace_price(m)
        print(f"  {before}  ->  {after}")
    print(f"  ... ({len(orig_matches)} total)")


if __name__ == "__main__":
    main()
