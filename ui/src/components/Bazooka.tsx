import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { get } from "../lib/request";
import type { Process } from "../lib/types";
import Display from "./Display";
import SideBar from "./SideBar";
import "react-toastify/dist/ReactToastify.css";

export default function Bazooka() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [PIDs, setPIDs] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      await fetchAllProcesses();
    })();
  }, []);

  useMemo(() => {
    const sortedProcesses = processes.sort((a, b) =>
      a.name == b.name ? 0 : a.name > b.name ? 1 : -1
    );
    setProcesses(sortedProcesses);
  }, [processes]);

  const fetchAllProcesses = async () => {
    try {
      setLoading(true);
      const data = await get("/processes");

      if (!data.ok) {
        toast(data.message, { type: "error" });
        return;
      }

      setProcesses(data.data);
      setPIDs([]);
    } catch (err) {
      toast("Something went wrong", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="w-full flex flex-col-reverse md:flex-row gap-6">
        <Display
          loading={loading}
          PIDs={PIDs}
          processes={processes}
          setProcesses={setProcesses}
          setPIDs={setPIDs}
        />
        <SideBar
          PIDs={PIDs}
          setProcesses={setProcesses}
          setLoading={setLoading}
          refresh={fetchAllProcesses}
        />
      </main>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar
        draggable
        closeOnClick
      />
    </>
  );
}
