import type { Process } from "../lib/types";
import { FaCheck } from "react-icons/fa/index";
import { useMemo } from "react";

interface Props {
  process: Process;
  selectedPIDs: Number[];
  handleSelect: (pid: number) => void;
}

export default function Row({ process, selectedPIDs, handleSelect }: Props) {
  const isSelected = useMemo(() => {
    return selectedPIDs.includes(process.pid);
  }, [process, selectedPIDs]);

  const checkboxStyle = "w-4 flex items-center justify-center aspect-square rounded-sm" + (isSelected ? " bg-emerald-400 bg-opacity-20" : " bg-zinc-800");

  return (
    <div className="bg-transparent text-sm text-zinc-500 font-medium border-b border-b-zinc-900 grid grid-cols-2 sm:grid-cols-3 items-center gap-2 px-1 py-3 mx-2">
      <div className="flex items-center gap-2">
        <button onClick={() => handleSelect(process.pid)}>
          <div className={checkboxStyle}>
            {isSelected ? <FaCheck size={9} className="text-emerald-400" /> : null}
          </div>
        </button>
        <p>{process.name}</p>
      </div>
      <p className="text-emerald-400 px-4">{process.pid}</p>
      <p className="hidden sm:block px-4">{process.ppid}</p>
    </div>
  );
}
