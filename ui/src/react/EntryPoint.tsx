import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC } from "react";

interface Props {
  Component: FC<any>;
}

export default function EntryPoint({ Component }: Props) {
  const queryClient = new QueryClient();

  const props = { queryClient };

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...props} />
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
