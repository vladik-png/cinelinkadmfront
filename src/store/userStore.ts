import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUsers, toggleUserAccountStatus } from '../api/userService';
import { UserData } from '../types/user';

interface UserStoreState {
    users: UserData[];
    loading: boolean;
    isInitialized: boolean;
    fetchUsers: (force?: boolean) => Promise<void>;
    toggleStatus: (user: UserData) => Promise<boolean | undefined>;
}

const parseUserResponse = (data: any): UserData[] => {
    if (data?.results?.data && Array.isArray(data.results.data)) {
        return data.results.data;
    } else if (data?.results && Array.isArray(data.results)) {
        return data.results;
    } else if (Array.isArray(data)) {
        return data;
    }
    return [];
};

export const useUserStore = create<UserStoreState>()(
    persist(
        (set, get) => ({
            users: [],
            loading: false,
            isInitialized: false,

            fetchUsers: async (force = false) => {
                const { isInitialized } = get();

                if (isInitialized && !force) {
                    getUsers()
                        .then((data) => {
                            set({ users: parseUserResponse(data) });
                        })
                        .catch((err) => console.error("API Background Refetch Error:", err));
                    return;
                }

                set({ loading: true });
                try {
                    const data = await getUsers();
                    set({ users: parseUserResponse(data), isInitialized: true });
                } catch (err) {
                    console.error("Error fetching users:", err);
                    set({ users: [], isInitialized: true });
                } finally {
                    set({ loading: false });
                }
            },

            toggleStatus: async (user: UserData) => {
                if (!user || user.user_id === undefined) return undefined;
                try {
                    await toggleUserAccountStatus(user.user_id, user.is_active);
                    const nextState = !user.is_active;

                    const currentUsers = get().users;
                    set({
                        users: currentUsers.map(u =>
                            u.user_id === user.user_id ? { ...u, is_active: nextState } : u
                        )
                    });

                    return nextState;
                } catch (err) {
                    console.error("Error changing status:", err);
                    throw err;
                }
            }
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({ users: state.users, isInitialized: state.isInitialized }),
        }
    )
);
