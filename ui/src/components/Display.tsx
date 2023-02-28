import { Fragment, useEffect, useState } from "react";
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

  useEffect(() => {
    if (processes != null) {
      setFilteredProcesses(null);
      setFilterQuery("");
    }
  }, [processes]);

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
    <section className="relative w-full md:w-[70%] h-[75vh] border border-neutral-900 rounded-lg overflow-hidden">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <Fragment>
          <div className="absolute top-0 left-0 w-full bg-neutral-900/50 backdrop-blur-md border-b border-b-neutral-900">
            <div className="w-full flex items-center gap-1 px-4 py-3">
              <BsFilter size={18} className="text-neutral-600" />
              <input
                name="filter"
                type="text"
                className="bg-transparent w-full focus:outline-none placeholder-neutral-600 px-1"
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
            <div className="display-title">
              <p>Name</p>
              <p>PID</p>
              <p>Parent PID</p>
            </div>
          </div>
          <div className="w-full h-full pt-24 pb-8 overflow-y-scroll">
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
              <div className="w-full h-full flex flex-col items-center justify-center">
                <p className="text-red-500 p-2">No match found.</p>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
}
