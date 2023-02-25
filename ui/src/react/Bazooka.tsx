import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Display from "../components/Display";
import SideBar from "../components/SideBar";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { fetchProcesses } from "../queries/process/fetch";
import type { Process } from "../lib/types";
import { onError } from "../lib/error";
import { QueryKeys } from "../queries/keys";

interface BazookaProps {
  queryClient: QueryClient;
}

export default function EntryPoint() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Bazooka queryClient={queryClient} />
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar
        draggable
        closeOnClick
      />
    </QueryClientProvider>
  );
}

export function Bazooka({ queryClient }: BazookaProps) {
  const [PIDs, setPIDs] = useState<number[]>([]);

  const processesQuery = useQuery({
    queryKey: [QueryKeys.PROCESSES],
    queryFn: fetchProcesses,
    onError,
  });

  return (
    <main className="w-full flex flex-col-reverse md:flex-row gap-6">
      <Display
        loading={processesQuery.isLoading || processesQuery.isFetching}
        PIDs={PIDs}
        processes={processesQuery.data as Process[]}
        setPIDs={setPIDs}
      />
      <SideBar PIDs={PIDs} queryClient={queryClient} />
    </main>
  );
}
