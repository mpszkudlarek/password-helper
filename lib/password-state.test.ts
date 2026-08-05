import { describe, expect, it } from "vitest";
import {
  initialPasswordState,
  type PasswordState,
  passwordReducer,
} from "./password-state";

const masked: PasswordState = {
  password: "abcd",
  visible: false,
  revealed: new Set([1, 2]),
};

describe("passwordReducer", () => {
  it("drops reveals when the password changes", () => {
    const next = passwordReducer(masked, { type: "set", password: "wxyz" });
    expect(next.password).toBe("wxyz");
    expect(next.revealed.size).toBe(0);
    expect(next.visible).toBe(false);
  });

  it("drops reveals when cleared", () => {
    const next = passwordReducer(masked, { type: "clear" });
    expect(next.password).toBe("");
    expect(next.revealed.size).toBe(0);
  });

  it("drops reveals when visibility flips", () => {
    const shown = passwordReducer(masked, { type: "toggleVisibility" });
    expect(shown.visible).toBe(true);
    expect(shown.revealed.size).toBe(0);

    const hidden = passwordReducer(shown, { type: "toggleVisibility" });
    expect(hidden.visible).toBe(false);
  });

  it("toggles a single position on and off", () => {
    const one = passwordReducer(initialPasswordState, {
      type: "toggleReveal",
      index: 3,
    });
    expect([...one.revealed]).toEqual([3]);

    const none = passwordReducer(one, { type: "toggleReveal", index: 3 });
    expect(none.revealed.size).toBe(0);
  });

  it("keeps other reveals when toggling one position", () => {
    const next = passwordReducer(masked, { type: "toggleReveal", index: 1 });
    expect([...next.revealed]).toEqual([2]);
  });
});
