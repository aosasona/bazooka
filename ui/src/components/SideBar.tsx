import { SyntheticEvent, useState } from "react";
import { FiChevronUp, FiChevronDown, FiRefreshCw } from "react-icons/fi/index";
import Loading from "./Loading";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { findByPort, killProcesses } from "../queries/process/mutations";
import { onError } from "../lib/error";
import { QueryKeys } from "../queries/keys";
import SystemResources from "./SystemResources";

interface Props {
  PIDs: Number[];
  queryClient: QueryClient;
}

export default function SideBar({ PIDs, queryClient }: Props) {
  const [port, setPort] = useState("");
  const [showResources, setShowResources] = useState(false);

  async function refetch() {
    await queryClient.refetchQueries({ queryKey: [QueryKeys.PROCESSES] });
  }

  const killProcessesMutation = useMutation({
    mutationFn: killProcesses,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.PROCESSES] });
    },
    onError,
  });

  const findByPortMutation = useMutation({
    mutationFn: findByPort,
    onSuccess: (data) => {
      queryClient.setQueryData([QueryKeys.PROCESSES], [data]);
    },
    onError,
  });

  function handleKillProcesses() {
    killProcessesMutation.mutate(PIDs);
  }

  const handleFindByPort = async (e: SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!port) {
        return await refetch();
      }

      findByPortMutation.mutate(port);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="w-full md:w-[30%] flex flex-col gap-4 md:-mt-10">
      <section>
        <div className="flex justify-end">
          <button
            className="bg-neutral-900/50 border border-neutral-900 rounded-md py-2 px-4 mb-3"
            onClick={() => refetch()}
          >
            <FiRefreshCw size={12} className="text-neutral-500" />
          </button>
        </div>
        <form className="space-y-3" onSubmit={handleFindByPort}>
          <input
            name="search"
            className="w-full text-sm bg-neutral-900/50 border border-neutral-900 placeholder-neutral-500 focus:outline-none focus:bordern focus:border-emerald-300 transition-all px-3 py-2.5 rounded-md"
            placeholder="Find process by port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-neutral-200 text-center text-neutral-900 py-2.5 rounded-md"
          >
            Search
          </button>
        </form>

        {killProcessesMutation.isLoading ? (
          <Loading />
        ) : (
          <button
            disabled={PIDs.length == 0}
            className="w-full text-red-500 disabled:opacity-40 hover:bg-neutral-900 font-medium text-center disabled:cursor-not-allowed rounded-md py-2.5 mt-6 transition-all"
            onClick={handleKillProcesses}
          >
            Kill selected processes
          </button>
        )}
      </section>

      <button
        className="w-full flex justify-between border-y border-y-neutral-900 text-neutral-500 py-4 px-1"
        onClick={() => setShowResources(!showResources)}
      >
        <p className="text-sm font-medium">System resources</p>
        <div className="px-2">
          {showResources ? <FiChevronDown /> : <FiChevronUp />}
        </div>
      </button>
      {showResources ? <SystemResources /> : null}
    </section>
  );
}
