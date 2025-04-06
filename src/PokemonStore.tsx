import { useSyncExternalStore } from "react";

type RawPokemon = {
  id: number;
  name: string;
  sprites: { [name: string]: string | { [name: string]: { [name: string]: string } } };
};

const pokedex: { [id: string]: Pokemon } = {};

export class Pokemon {
  data: RawPokemon;

  constructor(data: RawPokemon) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  get defaultBackImage() {
    return this.data.sprites.back_default;
  }

  get defaultFrontImage() {
    return this.data.sprites.front_default;
  }

  get allImages() {
    const res = Object.values(this.data.sprites).filter((v) => typeof v === "string");
    const other = Object.values(this.data.sprites.other)
      .map((x) => Object.values(x).filter((v) => typeof v === "string"))
      .flat();
    const versions = Object.values(this.data.sprites.versions)
      .map((x) =>
        Object.values(x)
          .map((y) =>
            typeof y === "object" && y !== null
              ? Object.values(y).filter((v) => typeof v === "string")
              : []
          )
          .flat()
      )
      .flat();

    return [...res, ...other, ...versions];
  }

  static async get(id: number) {
    if (pokedex[id]) {
      return pokedex[id];
    }

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const d = new Pokemon(await res.json());
    pokedex[d.id] = d;
    return d;
  }
}

const MAX_POKEMON_ID = 1025;

export class PokemonStore {
  static id = 1;
  static isLoading = false;
  static currentPokemon: Pokemon | null = null;
  static listeners = new Set<() => void>();
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
    PokemonStore.listeners.forEach((listener) => listener());
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
    PokemonStore.listeners.add(listener);
    return () => {
      PokemonStore.listeners.delete(listener);
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
