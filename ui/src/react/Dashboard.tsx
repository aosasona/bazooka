import { useState } from "react";
import Display from "../components/Display";
import SideBar from "../components/SideBar";
import { useQuery, QueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { fetchProcesses } from "../queries/process/fetch";
import type { Process } from "../lib/types";
import { onError } from "../lib/error";
import { QueryKeys } from "../queries/keys";
import EntryPoint from "./EntryPoint";

interface DashboardProps {
  queryClient: QueryClient;
}

export default function Dashboard(props: { "client:load": boolean }) {
  return <EntryPoint Component={DashboardComponent} />;
}

export function DashboardComponent({ queryClient }: DashboardProps) {
  const [PIDs, setPIDs] = useState<number[]>([]);

  const processesQuery = useQuery({
    queryKey: [QueryKeys.PROCESSES],
    queryFn: fetchProcesses,
    onError,
    refetchOnWindowFocus: false,
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
