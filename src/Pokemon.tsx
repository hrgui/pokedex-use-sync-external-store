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
