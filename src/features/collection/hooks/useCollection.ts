import { useCallback } from "react";
import { Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { CollectionService } from "../services/CollectionService";
import { DbCharacter } from "../repositories/CollectionRepository";

export default function useCollection() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // 1. Fetch collection state elements via React Query useQuery
  const collectionQuery = useQuery({
    queryKey: ["userCollection", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User must be authenticated.");
      return await CollectionService.getCollectionState(user.id);
    },
    enabled: !!user,
  });

  // 2. Select companion mutation
  const selectCompanionMutation = useMutation({
    mutationFn: async (companion: DbCharacter): Promise<boolean> => {
      if (!user) return false;
      const state = collectionQuery.data;
      const unlockedIds = state?.unlockedIds ?? new Set<string>();
      return await CollectionService.setActiveCompanion(user.id, companion, unlockedIds);
    },
    onSuccess: (_, companion) => {
      // Invalidate queries so both ProfileView, CollectionView, and HomeView refresh their active buddies immediately
      queryClient.invalidateQueries({ queryKey: ["userCollection", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
    },
    onError: (e: any) => {
      Alert.alert("Error", e.message || "Could not set companion.");
    },
  });

  const selectActiveCompanion = useCallback(
    async (companion: DbCharacter): Promise<boolean> => {
      try {
        const result = await selectCompanionMutation.mutateAsync(companion);
        if (result) {
          Alert.alert("Companion Set!", `"${companion.name}" is now set as your active reading buddy! ✦`);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    [selectCompanionMutation]
  );

  return {
    loading: collectionQuery.isLoading || selectCompanionMutation.isPending,
    characters: collectionQuery.data?.characters ?? [],
    unlockedIds: collectionQuery.data?.unlockedIds ?? new Set<string>(),
    activeId: collectionQuery.data?.activeId ?? null,
    loadCollection: () => collectionQuery.refetch(),
    selectActiveCompanion,
  };
}
