import { CollectionRepository, DbCharacter } from "../repositories/CollectionRepository";
import { AuthRepository } from "@/features/auth/repositories/AuthRepository";

export const CollectionService = {
  /**
   * Fetches full collection state (master list, unlocked claims, active id)
   */
  async getCollectionState(userId: string): Promise<{
    characters: DbCharacter[];
    unlockedIds: Set<string>;
    activeId: string | null;
  }> {
    if (!userId) {
      return { characters: [], unlockedIds: new Set(), activeId: null };
    }

    // 1. Fetch master characters ordered list from Repository
    const allChars = await CollectionRepository.fetchAllCharacters();

    // 2. Fetch unlocked characters IDs from Repository
    const unlockedIdsList = await CollectionRepository.fetchUnlockedCharacters(userId);

    // 3. Fetch active companion ID from profile AuthRepository
    const profile = await AuthRepository.fetchUserProfile(userId);

    return {
      characters: allChars || [],
      unlockedIds: new Set(unlockedIdsList || []),
      activeId: profile?.active_character_id || null,
    };
  },

  /**
   * Updates user's active companion character after verifying they have unlocked it
   */
  async setActiveCompanion(userId: string, companion: DbCharacter, unlockedIds: Set<string>): Promise<boolean> {
    if (!userId) return false;

    // Business check: Verifying they own the character milestone unlock claim
    const isUnlocked = unlockedIds.has(companion.id);
    if (!isUnlocked) {
      throw new Error(`This companion companion is locked! Required milestone not met.`);
    }

    // Update profiles active character
    await AuthRepository.updateProfile(userId, { active_character_id: companion.id });
    return true;
  },
};
