import { Fragment, useState } from "react";
import type { Process } from "../lib/types";
import { BsFilter } from "react-icons/bs/index";
import Loading from "./Loading";
import Row from "./Row";

interface Props {
  loading: boolean;
  PIDs: number[];
  setPIDs: (pid: number[]) => void;
  processes: Process[];
}
export default function Display({ loading, processes, PIDs, setPIDs }: Props) {
  const [filteredProcesses, setFilteredProcesses] = useState<Process[] | null>(
    null
  );
  const [filterQuery, setFilterQuery] = useState("");

  const toggleRowSelect = (pid: number) => {
    if (PIDs.includes(pid)) {
      const newPIDS = PIDs.filter((p) => p != pid);
      setPIDs(newPIDS);
      return;
    }

    setPIDs([...PIDs, pid]);
    return;
  };

  const filterProcessesByName = (q: string) => {
    setFilterQuery(q);
    if (!q) {
      return setFilteredProcesses(null);
    }
    const filtered = processes.filter(
      (process) => process.name.toLowerCase().indexOf(q.toLowerCase()) >= 0
    );
    return setFilteredProcesses(filtered);
  };

  return (
    <section className="w-full md:w-[70%] h-[75vh] border border-neutral-900 rounded-lg overflow-hidden">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <Fragment>
          <div className="bg-neutral-900 px-4 pt-2.5">
            <div className="w-full flex items-center gap-1">
              <BsFilter size={16} />
              <input
                name="filter"
                type="text"
                className="bg-transparent w-full focus:outline-none placeholder-neutral-500 px-1"
                placeholder="Filter by name..."
                value={filterQuery}
                onChange={(e) => filterProcessesByName(e.target?.value || "")}
              />
              {filteredProcesses && (
                <button
                  title="Clear filter and selected items"
                  className="text-red-500 text-xs font-medium px-2 py-1"
                  onClick={() => filterProcessesByName("")}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="text-sm text-neutral-500 font-medium grid grid-cols-3 items-center gap-2 py-2.5">
              <p>Name</p>
              <p>PID</p>
              <p>Parent PID</p>
            </div>
          </div>
          <div className="w-full h-full overflow-scroll pb-24">
            {(filteredProcesses || processes).length > 0 ? (
              <Fragment>
                {(filteredProcesses || processes).map((process, idx) => (
                  <Row
                    key={idx}
                    process={process}
                    selectedPIDs={PIDs}
                    handleSelect={toggleRowSelect}
                  />
                ))}
              </Fragment>
            ) : (
              <p className="text-neutral-600 p-2">No processes</p>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
}
