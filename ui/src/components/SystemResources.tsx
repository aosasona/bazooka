import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queries/keys";
import { onError } from "../lib/error";
import { fetchSystemResources } from "../queries/resources/fetch";
import { FiCpu } from "react-icons/fi/index";
import { FaMemory } from "react-icons/fa/index";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import Loading from "./Loading";

export default function SystemResources() {
  const resourcesQuery = useQuery({
    queryKey: [QueryKeys.SYSTEM_RESOURCES],
    queryFn: fetchSystemResources,
    onError,
    refetchOnWindowFocus: true,
    refetchInterval: 2500,
  });
  const { data } = resourcesQuery;

  if (resourcesQuery.isInitialLoading) {
    return (
      <div className="w-full aspect-square flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-6">
      <section>
        <StatsHeader Icon={FiCpu} title="CPU" />
        <StatsContainer>
          <Stat title="Cores (physical)" data={data?.cpu.physical_cores} />
          <Stat title="Cores (logical)" data={data?.cpu.logical_cores} />
          <Stat title="Usage" data={`${data?.cpu.total_usage}%`} isFull />
        </StatsContainer>
      </section>

      <section>
        <StatsHeader Icon={FaMemory} title="Memory (Virtual)" />
        <StatsContainer>
          <Stat
            title="Total Memory"
            data={`${data?.memory.total.raw}GB`}
            isFull
          />

          <Stat
            title="Available - GB"
            data={`${data?.memory.available.raw}GB`}
          />
          <Stat
            title="Available - %"
            data={`${data?.memory.available.percent}%`}
          />

          <Stat title="Used - GB" data={`${data?.memory.used.raw}GB`} />
          <Stat title="Used - %" data={`${data?.memory.used.percent}%`} />
        </StatsContainer>
      </section>
    </section>
  );
}

function StatsHeader({ Icon, title }: { Icon: IconType; title: string }) {
  return (
    <header className="flex text-emerald-400 items-center gap-2 mb-4">
      <Icon size={18} />
      <h4 className="font-medium">{title}</h4>
    </header>
  );
}

function StatsContainer({ children }: { children: ReactNode }) {
  return <div className="w-full grid grid-cols-2 gap-3">{children}</div>;
}

function Stat({
  title,
  data,
  isFull,
}: {
  title: string;
  data: string | number | undefined;
  isFull?: boolean;
}) {
  return (
    <div
      className={
        "w-full flex flex-col bg-neutral-900/60 border border-neutral-800 rounded-md py-2 px-2.5 " +
        (isFull ? "bg-emerald-400 col-span-full" : "")
      }
    >
      <p className="uppercase text-[10px] md:text-[9px] font-medium text-neutral-600">
        {title}
      </p>
      <h1 className="text-3xl md:text-xl lg:text-3xl font-bold text-emerald-400 mt-auto">
        {data || ""}
      </h1>
    </div>
  );
}
