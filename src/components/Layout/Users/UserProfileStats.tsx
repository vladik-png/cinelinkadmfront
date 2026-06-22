import * as React from 'react';
import { UserData } from '../../../types/user';
import { Users as UsersIcon, UserPlus, Download } from 'lucide-react';
import { getUserFollowers, getUserFollowing } from '../../../api/userService';

interface UserProfileStatsProps {
    user: UserData;
}

export const UserProfileStats: React.FC<UserProfileStatsProps> = ({ user }) => {
    const [followersCount, setFollowersCount] = React.useState<number>(user.followers ?? 0);
    const [followingsCount, setFollowingsCount] = React.useState<number>(user.followings ?? 0);

    React.useEffect(() => {
        if (!user.user_id) return;
        
        const fetchCounts = async () => {
            try {
                const fData = await getUserFollowers(user.user_id);
                const fList = fData?.results || fData?.data || fData || [];
                if (Array.isArray(fList)) setFollowersCount(fList.length);
            } catch (err) {
                console.error("Failed to load followers count:", err);
            }

            try {
                const followingData = await getUserFollowing(user.user_id);
                const followingList = followingData?.results || followingData?.data || followingData || [];
                if (Array.isArray(followingList)) setFollowingsCount(followingList.length);
            } catch (err) {
                console.error("Failed to load followings count:", err);
            }
        };

        fetchCounts();
    }, [user.user_id]);

    const exportToCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            alert("No data available to export.");
            return;
        }

        const delimiter = ";";
        const headers = ["User ID", "Username", "Mutual Friends", "Is Online"].join(delimiter);
        const dataRows = data.map(item => [
            item.user_id,
            item.username,
            item.mutual_friends_count || 0,
            item.is_online ? 'Yes' : 'No'
        ].join(delimiter));

        const csvContent = "\uFEFF" + [headers, ...dataRows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const handleExportFollowers = async () => {
        if (!user.user_id) return;
        try {
            const data = await getUserFollowers(user.user_id);
            const list = data?.results || data?.data || data || [];
            exportToCSV(list, `user_${user.user_id}_followers.csv`);
        } catch (error) {
            console.error("Failed to export followers:", error);
            alert("Failed to load followers for export.");
        }
    };

    const handleExportFollowing = async () => {
        if (!user.user_id) return;
        try {
            const data = await getUserFollowing(user.user_id);
            const list = data?.results || data?.data || data || [];
            exportToCSV(list, `user_${user.user_id}_following.csv`);
        } catch (error) {
            console.error("Failed to export following:", error);
            alert("Failed to load following for export.");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#151521] p-4 rounded-xl border border-white/[0.02] flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#3699ff]/10 flex items-center justify-center text-[#3699ff]">
                        <UsersIcon size={18} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-none mb-1">{followersCount}</p>
                        <p className="text-[10px] text-[#a2a5b9] font-bold uppercase tracking-widest">Followers</p>
                    </div>
                </div>
                <button 
                    onClick={handleExportFollowers}
                    className="p-2 text-[#a2a5b9] hover:text-[#3699ff] hover:bg-[#3699ff]/10 rounded-lg transition-colors cursor-pointer"
                    title="Export Followers to CSV"
                >
                    <Download size={16} />
                </button>
            </div>
            <div className="bg-[#151521] p-4 rounded-xl border border-white/[0.02] flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#3699ff]/10 flex items-center justify-center text-[#3699ff]">
                        <UserPlus size={18} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-none mb-1">{followingsCount}</p>
                        <p className="text-[10px] text-[#a2a5b9] font-bold uppercase tracking-widest">Following</p>
                    </div>
                </div>
                <button 
                    onClick={handleExportFollowing}
                    className="p-2 text-[#a2a5b9] hover:text-[#3699ff] hover:bg-[#3699ff]/10 rounded-lg transition-colors cursor-pointer"
                    title="Export Following to CSV"
                >
                    <Download size={16} />
                </button>
            </div>
        </div>
    );
};
