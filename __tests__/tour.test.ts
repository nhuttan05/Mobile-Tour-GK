import { groupByCity, formatDate, getSeatLabel, Tour } from '../utils/tour';

const mockTours: Tour[] = [
  { id: '1', name: 'Tour 1', city: 'Hà Nội', days: 3, price: 100, seats: 5, departure: '2026-12-01', image: '', isFavorite: false },
  { id: '2', name: 'Tour 2', city: 'Đà Lạt', days: 2, price: 200, seats: 2, departure: '2026-11-05', image: '', isFavorite: false },
  { id: '3', name: 'Tour 3', city: 'Đà Lạt', days: 2, price: 200, seats: 0, departure: '2026-10-01', image: '', isFavorite: false },
];

describe('utils/tour tests', () => {
  test('groupByCity gom nhóm và sắp xếp đúng', () => {
    const res = groupByCity(mockTours);
    expect(res.length).toBe(2);
    expect(res[0].title).toBe('Đà Lạt');
    expect(res[1].title).toBe('Hà Nội');
    expect(res[0].data[0].departure).toBe('2026-10-01'); // ngày tăng dần
  });

  test('formatDate đúng định dạng', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });

  test('getSeatLabel xử lý đúng biên 0, 3, 4', () => {
    expect(getSeatLabel(0)).toBe('Hết chỗ');
    expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
    expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
  });
});