import * as React from 'react';
import { useModerationLogic } from '../hooks/useModerationLogic';
import { UserReportsTable } from '../components/Layout/Moderation/UserReportsTable';

const Moderation: React.FC = () => {
  const {
    userReports,
    reportsLoading,
    reportSort,
    handleSortChange,
    loadMoreReports,
    hasMoreReports
  } = useModerationLogic();

  return (
    <div className="w-full min-h-screen bg-[#151521] text-[#a2a5b9] font-sans p-6 lg:p-8">
        
        <div className="flex justify-between items-end border-b border-white/[0.05] pb-6 mb-6">
            <div>
                <h1 className="text-3xl text-white tracking-wide uppercase font-bold leading-none">Moderation Center</h1>
                <p className="text-[10px] text-[#a2a5b9] tracking-widest uppercase font-semibold mt-2">Manage and review user reports</p>
            </div>
        </div>

        <div className="mb-6">
          <UserReportsTable
            reports={userReports}
            loading={reportsLoading}
            sort={reportSort}
            onSortChange={handleSortChange}
            onLoadMore={loadMoreReports}
            hasMore={hasMoreReports}
          />
        </div>
    </div>
  );
};

export default Moderation;