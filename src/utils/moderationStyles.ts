export const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('err') || s.includes('fail') || s.includes('crit') || s.includes('offline')) return 'bg-[#f64e60]/10 text-[#f64e60] border-[#f64e60]/20';
    if (s.includes('warn')) return 'bg-[#ffa800]/10 text-[#ffa800] border-[#ffa800]/20';
    if (s.includes('succ') || s.includes('ok') || s.includes('online')) return 'bg-[#1bc5bd]/10 text-[#1bc5bd] border-[#1bc5bd]/20';
    return 'bg-[#3699ff]/10 text-[#3699ff] border-[#3699ff]/20';
};