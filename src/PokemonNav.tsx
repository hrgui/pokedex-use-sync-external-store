import { usePokemonStore, PokemonStore, MAX_POKEMON_ID } from "./PokemonStore";

export const PokemonNav = () => {
  const { id } = usePokemonStore();

  const inc = () => {
    return PokemonStore.increment();
  };

  const dec = () => {
    return PokemonStore.decrement();
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    return PokemonStore.validate(+e.target.value) && PokemonStore.setId(+e.target.value);
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={dec}
        disabled={!PokemonStore.validate(id - 1)}
      >
        &laquo;
      </button>
      <input
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        value={id}
        onChange={handleInputChange}
        min={1}
        max={MAX_POKEMON_ID}
      />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={inc}
        disabled={!PokemonStore.validate(id + 1)}
      >
        &raquo;
      </button>
    </div>
  );
};
