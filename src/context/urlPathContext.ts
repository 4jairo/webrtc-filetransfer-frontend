import { writable } from "svelte/store"


const createContext = () => {
  const State = writable<string>('/')

  return {
    subscribe: State.subscribe,
    set: State.set,
  }
}

export const UrlPathConext = createContext()