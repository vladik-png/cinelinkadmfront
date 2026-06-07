import { create } from 'zustand';
import { getUsers, toggleUserAccountStatus } from '../api/userService';
import { UserData } from '../types/user';

interface UserStoreState {
    users: UserData[];
    loading: boolean;
    isInitialized: boolean;
    fetchUsers: (force?: boolean) => Promise<void>;
    toggleStatus: (user: UserData) => Promise<boolean | undefined>;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
    users: [],
    loading: false,
    isInitialized: false,

    fetchUsers: async (force = false) => {
        const { isInitialized } = get();

        if (isInitialized && !force) {
            getUsers()
                .then((data) => {
                    if (data && data.results && Array.isArray(data.results.data)) {
                        set({ users: data.results.data });
                    } else if (data && Array.isArray(data.results)) {
                        set({ users: data.results });
                    } else if (Array.isArray(data)) {
                        set({ users: data });
                    }
                })
                .catch((err) => console.error("API Background Refetch Error:", err));
            return;
        }

        set({ loading: true });
        try {
            const data = await getUsers();
            if (data && data.results && Array.isArray(data.results.data)) {
                set({ users: data.results.data, isInitialized: true });
            } else if (data && Array.isArray(data.results)) {
                set({ users: data.results, isInitialized: true });
            } else if (Array.isArray(data)) {
                set({ users: data, isInitialized: true });
            } else {
                set({ users: [], isInitialized: true });
            }
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
}));