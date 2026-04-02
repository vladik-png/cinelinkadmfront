export const getLocalWeather = async (location: string) => {
  const cleanCity = location.replace(/city/gi, '').trim();
  let query = cleanCity;
  if (!query.toLowerCase().includes('ukraine')) {
    query += ',Ukraine';
  }
  const encodedQuery = encodeURIComponent(query);
  
  try {
    const res = await fetch(`https://wttr.in/${encodedQuery}?format=j1`);
    return await res.json();
  } catch (error) {
    console.error("Помилка отримання погоди:", error);
    throw error;
  }
};