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

export default function Bazooka() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [PIDs, setPIDs] = useState<number[]>([]);

  const queryClient = new QueryClient();
  const { isLoading, refetch } = useQuery({
    queryKey: ["processes"],
    queryFn: fetchProcesses,
    onSuccess: (data) => {
      if (data) {
        setProcesses(data);
      }
    },
    onError,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <main className="w-full flex flex-col-reverse md:flex-row gap-6">
        <Display
          loading={isLoading}
          PIDs={PIDs}
          processes={processes}
          setProcesses={setProcesses}
          setPIDs={setPIDs}
        />
        <SideBar PIDs={PIDs} refetch={refetch} queryClient={queryClient} />
      </main>
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
