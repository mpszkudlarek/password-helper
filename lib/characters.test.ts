import { describe, expect, it } from "vitest";
import {
  classifyChar,
  sanitizeGraphemes,
  segmentGraphemes,
} from "./characters";

const ZWJ_FAMILY = "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}";

describe("classifyChar", () => {
  it("splits ASCII into digits, cases and symbols", () => {
    expect(classifyChar("7")).toBe("digit");
    expect(classifyChar("A")).toBe("uppercase");
    expect(classifyChar("a")).toBe("lowercase");
    expect(classifyChar("!")).toBe("symbol");
    expect(classifyChar(" ")).toBe("symbol");
  });

  it("recognises case outside ASCII", () => {
    expect(classifyChar("Ż")).toBe("uppercase");
    expect(classifyChar("ż")).toBe("lowercase");
  });

  it("treats caseless graphemes as symbols", () => {
    expect(classifyChar("😀")).toBe("symbol");
    expect(classifyChar("漢")).toBe("symbol");
  });
});

describe("segmentGraphemes", () => {
  it("counts one entry per user-perceived character", () => {
    expect(segmentGraphemes("abc")).toEqual(["a", "b", "c"]);
  });

  it("keeps a ZWJ emoji sequence as a single grapheme", () => {
    expect(segmentGraphemes(ZWJ_FAMILY)).toEqual([ZWJ_FAMILY]);
  });

  it("keeps a combining mark with its base letter", () => {
    expect(segmentGraphemes("e\u0301")).toEqual(["e\u0301"]);
  });

  it("keeps a regional indicator pair as one flag", () => {
    expect(segmentGraphemes("🇵🇱")).toHaveLength(1);
  });
});

describe("sanitizeGraphemes", () => {
  it("drops invisible graphemes and reports how many", () => {
    const { graphemes, removed } = sanitizeGraphemes(
      segmentGraphemes("a\u200Bb\u202Ec")
    );
    expect(graphemes).toEqual(["a", "b", "c"]);
    expect(removed).toBe(2);
  });

  it("drops a CRLF, which segments as one grapheme", () => {
    const { graphemes, removed } = sanitizeGraphemes(
      segmentGraphemes("a\r\nb")
    );
    expect(graphemes).toEqual(["a", "b"]);
    expect(removed).toBe(1);
  });

  it("keeps emoji whose clusters contain a joiner", () => {
    const { graphemes, removed } = sanitizeGraphemes(
      segmentGraphemes(ZWJ_FAMILY)
    );
    expect(graphemes).toEqual([ZWJ_FAMILY]);
    expect(removed).toBe(0);
  });

  it("leaves ordinary input untouched", () => {
    const { graphemes, removed } = sanitizeGraphemes(
      segmentGraphemes("Coexist0-Electable-Marlin")
    );
    expect(graphemes).toHaveLength(25);
    expect(removed).toBe(0);
  });
});
