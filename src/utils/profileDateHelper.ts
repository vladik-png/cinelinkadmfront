export const formatProfileDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
        let fixedString = dateString.trim().replace(' ', 'T');
        const date = new Date(fixedString);
        if (isNaN(date.getTime())) {
            const simpleDate = dateString.split(' ')[0];
            if (simpleDate.includes('-')) {
                const [y, m, d] = simpleDate.split('-');
                return `${d}.${m}.${y}`;
            }
            return 'N/A';
        }
        return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return 'N/A';
    }
};