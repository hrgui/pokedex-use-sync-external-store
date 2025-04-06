import { usePokemonStore, PokemonStore } from "./PokemonStore";

export const PokemonNav = () => {
  const { id } = usePokemonStore();

  const inc = () => {
    return PokemonStore.validate(id + 1) && PokemonStore.increment();
  };

  const dec = () => {
    return PokemonStore.validate(id - 1) && PokemonStore.decrement();
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    return PokemonStore.validate(id - 1) && PokemonStore.setId(+e.target.value);
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={dec}
      >
        &laquo;
      </button>
      <input
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="number"
        value={id}
        onChange={handleInputChange}
      />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={inc}
      >
        &raquo;
      </button>
    </div>
  );
};
