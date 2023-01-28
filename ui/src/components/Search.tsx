import { Dispatch, SetStateAction, useState } from "react";
import type { Process } from "../lib/types";

interface Props {
  PIDs: Number[];
  setProcesses: Dispatch<SetStateAction<Process[]>>;
}

export default function Search({ PIDs, setProcesses }: Props) {
  const [query, setQuery] = useState("");

  return (
    <section className="w-full md:w-[30%]">
      <form className="space-y-3">
        <input
          name="search"
          className="w-full text-sm bg-zinc-800 placeholder-zinc-500 focus:outline-none focus:border-none px-3 py-2.5 rounded-md"
          placeholder="Find process by port"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-zinc-200 text-center text-zinc-900 py-2 rounded-md"
        >
          Search
        </button>
      </form>

      <button
        disabled={PIDs.length == 0}
        className="w-full text-red-500 disabled:opacity-40 hover:bg-zinc-800 font-medium text-center disabled:cursor-not-allowed rounded-md py-2.5 mt-6 transition-all"
      >
        Kill selected processes
      </button>
    </section>
  );
}
