export const formatDate = (dateString?: string) => {
    if (!dateString) return { date: 'N/A', time: '' };

    try {
        let fixedString = dateString.trim().replace(' ', 'T');
        const date = new Date(fixedString);
        if (isNaN(date.getTime())) {
            const simpleDate = dateString.split(' ')[0];
            if (simpleDate.includes('-')) {
                const [y, m, d] = simpleDate.split('-');
                return { date: `${d}.${m}.${y}`, time: '' };
            }
            return { date: 'N/A', time: '' };
        }

        return {
            date: date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            time: date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
        };
    } catch (err) {
        return { date: 'N/A', time: '' };
    }
};