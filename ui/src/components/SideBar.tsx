import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi/index";
import Loading from "./Loading";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { killProcesses } from "../queries/process/mutations";
import { onError } from "../lib/error";

interface Props {
  PIDs: Number[];
  queryClient: QueryClient;
  refetch: Function;
}

export default function SideBar({ PIDs, refetch, queryClient }: Props) {
  const [port, setPort] = useState("");

  const killProcessesMutation = useMutation({
    mutationFn: killProcesses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processes"] });
    },
    onError,
  });

  function handleKillProcesses() {
    killProcessesMutation.mutate(PIDs);
  }

  // const findProcessByPort = async (e: SyntheticEvent<HTMLFormElement>) => {
  //   try {
  //     e.preventDefault();
  //
  //     if (!port) {
  //       return await refresh();
  //     }
  //
  //     setLoading(true);
  //     const data = await get(`/processes/port/${port}`);
  //
  //     if (!data.ok) {
  //       toast(data?.message, { type: "error" });
  //       return;
  //     }
  //
  //     setProcesses([data.data]);
  //     toast(data?.message, { type: "success" });
  //   } catch (err: any) {
  //     toast("Something went wrong", { type: "error" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <section className="w-full md:w-[30%]">
      <div className="flex justify-end">
        <button
          className="bg-zinc-800 rounded-md py-2 px-4 mb-3"
          onClick={() => refetch()}
        >
          <FiRefreshCw size={12} className="text-zinc-500" />
        </button>
      </div>
      <form className="space-y-3" onSubmit={() => "// do later"}>
        <input
          name="search"
          className="w-full text-sm bg-zinc-800 placeholder-zinc-500 focus:outline-none focus:border-none px-3 py-2.5 rounded-md"
          placeholder="Find process by port"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-zinc-200 text-center text-zinc-900 py-2 rounded-md"
        >
          Search
        </button>
      </form>

      {killProcessesMutation.isLoading ? (
        <Loading />
      ) : (
        <button
          disabled={PIDs.length == 0}
          className="w-full text-red-500 disabled:opacity-40 hover:bg-zinc-800 font-medium text-center disabled:cursor-not-allowed rounded-md py-2.5 mt-6 transition-all"
          onClick={handleKillProcesses}
        >
          Kill selected processes
        </button>
      )}
    </section>
  );
}
