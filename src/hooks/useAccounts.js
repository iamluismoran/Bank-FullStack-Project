import { useQuery } from "@tanstack/react-query";
import { listAccounts, getAccount, getAccountBalance } from "../api/accounts";

/** Listado con búsqueda + paginación */
export function useAccountsList(search, page, pageSize) {
  return useQuery({
    queryKey: ["accounts", { search, page, pageSize }],
    queryFn: () => listAccounts({ search, page, pageSize }),
    keepPreviousData: true,
    retry: 1,
  });
}

/** Detalle de una cuenta */
export function useAccountDetail(id) {
  return useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccount(id),
    enabled: !!id,
    retry: 1,
  });
}

/** Saldo en vivo de una cuenta */
export function useAccountBalance(id) {
  return useQuery({
    queryKey: ["account", "balance", id],
    queryFn: () => getAccountBalance(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
