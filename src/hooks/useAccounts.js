import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listAccounts,
  getAccount,
  getAccountBalance,
  createCheckingOrStudent,
  createSavings,
  createCreditCard,
  updateAccountStatus,
  deleteAccount,
} from "../api/accounts";

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

/** Crear cuenta (elige endpoint según type) */
export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // payload: { type, primaryOwnerId, secondaryOwnerId?, initialAmount, secretKey?, minimumBalance?, interestRate?, creditLimit? }
      const type = payload?.type;
      if (!type) throw new Error("type is required");

      if (type === "CHECKING" || type === "STUDENT_CHECKING") {
        const { type: _t, ...rest } = payload;
        return createCheckingOrStudent(rest);
      }
      if (type === "SAVINGS") {
        const { type: _t, ...rest } = payload;
        return createSavings(rest);
      }
      if (type === "CREDIT_CARD") {
        const { type: _t, ...rest } = payload;
        return createCreditCard(rest);
      }
      throw new Error(`Unsupported type: ${type}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

/** Cambiar estado ACTIVE/FROZEN */
export function useUpdateStatus(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status) => updateAccountStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", id] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

/** Eliminar cuenta */
export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}