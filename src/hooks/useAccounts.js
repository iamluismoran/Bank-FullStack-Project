import { useQuery } from "@tanstack/react-query";
import { listAccounts } from "../api/accounts";

export function useAccountsList(search, page, pageSize) {
  return useQuery({
    queryKey: ["accounts", { search, page, pageSize }],
    queryFn: () => listAccounts({ search, page, pageSize }),
    keepPreviousData: true,
    retry: 1,
  });
}
