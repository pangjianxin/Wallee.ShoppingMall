// stores/init-prompt.ts
import { create } from "zustand";

type InitPromptState = {
  prompt: string | null;
  setPrompt: (value: string) => void;
  consumePrompt: () => string | null;
};

export const useInitPromptStore = create<InitPromptState>((set, get) => ({
  prompt: null,
  setPrompt: (value) => set({ prompt: value }),
  consumePrompt: () => {
    const value = get().prompt;
    if (value) set({ prompt: null });
    return value;
  },
}));
