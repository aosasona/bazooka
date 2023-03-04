import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queries/keys";
import { onError } from "../lib/error";
import { fetchSystemResources } from "../queries/resources/fetch";
import { FiCpu } from "react-icons/fi/index";
import { FaMemory } from "react-icons/fa/index";
import type { IconType } from "react-icons";
import { ReactNode, useEffect, useState } from "react";
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
  const [supportsResources, setSupportsResources] = useState(false);

  useEffect(() => {
    const hasNullorUndefined = Object.values(data || {}).some(
      (val) => val == null || val == undefined
    );
    setSupportsResources(!hasNullorUndefined);
  }, [data]);

  if (resourcesQuery.isInitialLoading) {
    return (
      <div className="w-full aspect-square flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!supportsResources) {
    return (
      <div className="w-full aspect-video flex items-center justify-center">
        <p className="text-neutral-500">
          Oops, your machine is not supported (yet)...
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-6">
      <section>
        <StatsHeader Icon={FiCpu} title="CPU" />
        <StatsContainer>
          <Stat
            title="Cores (physical)"
            data={data?.cpu?.physical_cores || 0}
          />
          <Stat title="Cores (logical)" data={data?.cpu?.logical_cores || 0} />
          <Stat title="Usage" data={`${data?.cpu?.total_usage || 0}%`} isFull />
        </StatsContainer>
      </section>

      <section>
        <StatsHeader Icon={FaMemory} title="Memory (Virtual)" />
        <StatsContainer>
          <Stat
            title="Total Memory"
            data={`${data?.memory?.total?.raw || 0}GB`}
            isFull
          />

          <Stat
            title="Available - GB"
            data={`${data?.memory?.available?.raw || 0}GB`}
          />
          <Stat
            title="Available - %"
            data={`${data?.memory?.available?.percent || 0}%`}
          />

          <Stat title="Used - GB" data={`${data?.memory?.used?.raw || 0}GB`} />
          <Stat
            title="Used - %"
            data={`${data?.memory?.used?.percent || 0}%`}
          />
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
