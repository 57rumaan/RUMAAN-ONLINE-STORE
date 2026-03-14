import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface ProductMedia {
  id: number;
  productId: number;
  url: string;
  type: string;
  sortOrder: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  ordersPerDay: { date: string; count: number; revenue: number }[];
  topProducts: { productId: number; productName: string; orderCount: number; revenue: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export interface OrderWithDetails {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  receiptId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  receiptImage?: string | null;
  status: string;
  createdAt: string;
}

export const useGetProductMedia = (productId: number) =>
  useQuery<ProductMedia[]>({
    queryKey: ["product-media", productId],
    queryFn: () => customFetch(`/api/products/${productId}/media`),
    enabled: !!productId,
  });

export const useAddProductMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, url, type, sortOrder }: { productId: number; url: string; type: string; sortOrder?: number }) =>
      customFetch<ProductMedia>(`/api/products/${productId}/media`, {
        method: "POST",
        body: JSON.stringify({ url, type, sortOrder }),
      }),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["product-media", vars.productId] }),
  });
};

export const useDeleteProductMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, mediaId }: { productId: number; mediaId: number }) =>
      customFetch(`/api/products/${productId}/media/${mediaId}`, { method: "DELETE", responseType: "text" }),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["product-media", vars.productId] }),
  });
};

