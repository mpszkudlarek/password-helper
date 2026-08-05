export interface PasswordState {
  password: string;
  visible: boolean;
  /** Positions temporarily unmasked while `visible` is false. */
  revealed: ReadonlySet<number>;
}

export type PasswordAction =
  | { type: "set"; password: string }
  | { type: "clear" }
  | { type: "toggleVisibility" }
  | { type: "toggleReveal"; index: number };

const NO_REVEALS: ReadonlySet<number> = new Set();

export const initialPasswordState: PasswordState = {
  password: "",
  visible: true,
  revealed: NO_REVEALS,
};

// Reveals are tied to the characters they were made for, so anything that
// changes the password - or unmasks it wholesale - drops them.
export function passwordReducer(
  state: PasswordState,
  action: PasswordAction
): PasswordState {
  switch (action.type) {
    case "set":
      return { ...state, password: action.password, revealed: NO_REVEALS };
    case "clear":
      return { ...state, password: "", revealed: NO_REVEALS };
    case "toggleVisibility":
      return { ...state, visible: !state.visible, revealed: NO_REVEALS };
    case "toggleReveal": {
      const revealed = new Set(state.revealed);
      if (!revealed.delete(action.index)) revealed.add(action.index);
      return { ...state, revealed };
    }
  }
}
