import type { SearchBy } from "../lib/types";

interface Props {
  name: string;
  value: SearchBy;
  selected: SearchBy;
  handleClick: (value: SearchBy) => void;
}

export default function SearchByCard({
  name,
  value,
  selected,
  handleClick,
}: Props) {
  const cardClass = selected === value ? "w-full bg-zinc-800 border-0" : "w-full text-zinc-600 border border-zinc-600";
  return (
    <button
      type="button"
      className={cardClass + " text-xs font-medium p-3 rounded-md"}
      onClick={() => handleClick(value)}
    >
      {name}
    </button>
  );
}
