import { create } from "zustand";

export type EventMap = {
  chatPrefill: string;
};

type Listener<K extends keyof EventMap> = (payload: EventMap[K]) => void;

type EventBusState = {
  publish: <K extends keyof EventMap>(event: K, payload: EventMap[K]) => void;
  subscribe: <K extends keyof EventMap>(
    event: K,
    listener: Listener<K>
  ) => () => void;
};

const listeners: Partial<Record<keyof EventMap, Set<Listener<any>>>> = {};

export const useEventBus = create<EventBusState>(() => ({
  publish: (event, payload) => {
    const eventListeners = listeners[event];
    if (!eventListeners) return;
    // Copy to array to avoid issues if listeners mutate during iteration.
    [...eventListeners].forEach((listener) => listener(payload));
  },
  subscribe: (event, listener) => {
    let eventListeners = listeners[event];
    if (!eventListeners) {
      eventListeners = new Set();
      listeners[event] = eventListeners;
    }
    eventListeners.add(listener as Listener<any>);

    return () => {
      eventListeners?.delete(listener as Listener<any>);
      if (eventListeners && eventListeners.size === 0) {
        delete listeners[event];
      }
    };
  },
}));
