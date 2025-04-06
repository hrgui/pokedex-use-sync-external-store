import { useSyncExternalStore } from "react";
import { Pokemon } from "./Pokemon";

export const MAX_POKEMON_ID = 1025;

export class PokemonStore {
  static id = 1;
  static isLoading = false;
  static currentPokemon: Pokemon | null = null;
  static eventTarget = new EventTarget(); // Use EventTarget for event handling
  static currentState = {
    id: PokemonStore.id,
    currentPokemon: PokemonStore.currentPokemon,
    isLoading: PokemonStore.isLoading,
  };

  static init() {
    PokemonStore.fetchPokemon(PokemonStore.id);
  }

  static validate = (id: number) => {
    if (isNaN(id)) {
      return false;
    }

    if (id < 1) {
      return false;
    }

    if (id > MAX_POKEMON_ID) {
      return false;
    }

    return true;
  };

  static emitChange() {
    const event = new CustomEvent("change");
    PokemonStore.eventTarget.dispatchEvent(event); // Dispatch a "change" event
  }

  static fetchPokemon(id: number) {
    return Pokemon.get(id).then((data) => {
      PokemonStore.currentPokemon = data;
      PokemonStore.isLoading = false;
      PokemonStore.updateState();
    });
  }

  static updateState() {
    PokemonStore.currentState = {
      id: PokemonStore.id,
      currentPokemon: PokemonStore.currentPokemon,
      isLoading: PokemonStore.isLoading,
    };
    PokemonStore.emitChange();
  }

  static setId(id: number) {
    PokemonStore.id = id;
    PokemonStore.isLoading = true;
    PokemonStore.currentPokemon = null;
    PokemonStore.updateState();
    PokemonStore.fetchPokemon(PokemonStore.id);
  }

  static async increment() {
    PokemonStore.setId(PokemonStore.id + 1);
  }

  static decrement() {
    PokemonStore.setId(PokemonStore.id - 1);
  }

  static subscribe(listener: () => void) {
    PokemonStore.eventTarget.addEventListener("change", listener);
    return () => {
      PokemonStore.eventTarget.removeEventListener("change", listener);
    };
  }

  static getSnapshot() {
    return PokemonStore.currentState;
  }
}

// @ts-expect-error Window
(window as Window & { PokemonStore: PokemonStore }).PokemonStore = PokemonStore;

export function usePokemonStore() {
  return useSyncExternalStore(PokemonStore.subscribe, PokemonStore.getSnapshot);
}
