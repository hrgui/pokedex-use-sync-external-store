import "./App.css";
import { PokemonView } from "./PokemonView";
import { PokemonStore, usePokemonStore } from "./PokemonStore";
import { PokemonNav } from "./PokemonNav";

PokemonStore.init();

function App() {
  const { id, isLoading, currentPokemon } = usePokemonStore();
  return (
    <div className="mx-auto w-[400px]">
      <PokemonNav />
      <PokemonView id={id} loading={isLoading} data={currentPokemon} />
      <PokemonNav />
    </div>
  );
}

export default App;
