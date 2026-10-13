export interface Tour {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string; // YYYY-MM-DD
  image: string;
  isFavorite: boolean;
}

// Câu 2a: Gom nhóm theo thành phố A -> Z, ngày departure tăng dần
export const groupByCity = (tours: Tour[]) => {
  const map: { [city: string]: Tour[] } = {};

  tours.forEach(t => {
    if (!map[t.city]) map[t.city] = [];
    map[t.city].push(t);
  });

  const sortedCities = Object.keys(map).sort((a, b) => a.localeCompare(b));

  return sortedCities.map(city => ({
    title: city,
    data: map[city].sort((a, b) => a.departure.localeCompare(b.departure)),
  }));
};

// Câu 3b: Định dạng ngày dd/MM/yyyy
export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

// Câu 3b: Nhãn số chỗ
export const getSeatLabel = (seats: number) => {
  if (seats === 0) return 'Hết chỗ';
  if (seats >= 1 && seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
};