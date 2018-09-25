import dayjs from 'dayjs';
import { enhancePricingEstimates } from '../../src/services/availability';

describe('services.availability', () => {
  let guestData;

  beforeEach(() => {
    guestData = {
      arrival: '2018-01-03',
      departure: '2018-01-07',
      guestAges: [18, 20],
      helpers: {
        arrivalDateDayjs: dayjs('2018-01-03'),
        departureDateDayjs: dayjs('2018-01-07'),
        lengthOfStay: 4,
        numberOfGuests: 2,
      },
    };
  });

  describe.only('enhancePricingEstimates', () => {
    it('should add undefined quantity if availability data is missing totally', () => {
      const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {});
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('quantity', undefined);
    });

    it('should add undefined quantity if availability data is missing for given room', () => {
      const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
        availability: {
          availability: {},
        },
      });
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('quantity', undefined);
    });

    it('should add undefined quantity if availability data is empty', () => {
      const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
        availability: {
          availability: {
            rta: {},
          },
        },
      });
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('quantity', undefined);
    });

    it('should add quantity if availability data is there', () => {
      const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
        availability: {
          availability: {
            rta: {
              '2018-01-03': { date: '2018-01-03', quantity: 7 },
              '2018-01-04': { date: '2018-01-04', quantity: 7 },
              '2018-01-05': { date: '2018-01-05', quantity: 7 },
              '2018-01-06': { date: '2018-01-06', quantity: 7 },
            },
          },
        },
      });
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('quantity', 7);
    });

    it('should add the lowest quantity if availability data is there', () => {
      const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
        availability: {
          availability: {
            rta: {
              '2018-01-03': { date: '2018-01-03', quantity: 7 },
              '2018-01-04': { date: '2018-01-04', quantity: 6 },
              '2018-01-05': { date: '2018-01-05', quantity: 0 },
              '2018-01-06': { date: '2018-01-06', quantity: 3 },
              '2018-01-07': { date: '2018-01-07', quantity: 1 },
            },
          },
        },
      });
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('quantity', 0);
    });

    it('should add undefined quantity if at least one day is missing', () => {
      const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
        availability: {
          availability: {
            rta: {
              '2018-01-03': { date: '2018-01-03', quantity: 7 },
              '2018-01-06': { date: '2018-01-06', quantity: 3 },
            },
          },
        },
      });
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('quantity', undefined);
    });

    it('should work for multiple room types', () => {
      const result = enhancePricingEstimates(guestData, [{ id: 'rta' }, { id: 'rtb' }], {
        availability: {
          availability: {
            rta: {
              '2018-01-03': { date: '2018-01-03', quantity: 7 },
              '2018-01-04': { date: '2018-01-04', quantity: 6 },
              '2018-01-05': { date: '2018-01-05', quantity: 5 },
              '2018-01-06': { date: '2018-01-06', quantity: 3 },
              '2018-01-07': { date: '2018-01-07', quantity: 1 },
            },
            rtb: {
              '2018-01-03': { date: '2018-01-03', quantity: 17 },
              '2018-01-04': { date: '2018-01-04', quantity: 1 },
              '2018-01-05': { date: '2018-01-05', quantity: 15 },
              '2018-01-06': { date: '2018-01-06', quantity: 13 },
              '2018-01-07': { date: '2018-01-07', quantity: 11 },
            },
          },
        },
      });
      expect(result.length).toBe(2);
      expect(result.find(r => r.id === 'rta')).toHaveProperty('quantity', 3);
      expect(result.find(r => r.id === 'rtb')).toHaveProperty('quantity', 1);
    });

    describe('restrictions', () => {
      it('should apply noArrival on a first day of trip', () => {
        const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
          availability: {
            availability: {
              rta: {
                '2018-01-03': {
                  date: '2018-01-03',
                  quantity: 7,
                  restrictions: {
                    noArrival: true,
                  },
                },
                '2018-01-04': { date: '2018-01-04', quantity: 7 },
                '2018-01-05': { date: '2018-01-05', quantity: 7 },
                '2018-01-06': { date: '2018-01-06', quantity: 7 },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', undefined);
      });

      it('should not apply noArrival on a non-first day of trip', () => {
        const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
          availability: {
            availability: {
              rta: {
                '2018-01-03': { date: '2018-01-03', quantity: 7 },
                '2018-01-04': {
                  date: '2018-01-04',
                  quantity: 7,
                  restrictions: {
                    noArrival: true,
                  },
                },
                '2018-01-05': { date: '2018-01-05', quantity: 7 },
                '2018-01-06': { date: '2018-01-06', quantity: 7 },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', 7);
      });

      it('should apply noDeparture on a last day of trip', () => {
        const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
          availability: {
            availability: {
              rta: {
                '2018-01-03': { date: '2018-01-03', quantity: 7 },
                '2018-01-04': { date: '2018-01-04', quantity: 7 },
                '2018-01-05': { date: '2018-01-05', quantity: 7 },
                '2018-01-06': { date: '2018-01-06', quantity: 7 },
                '2018-01-07': {
                  date: '2018-01-07',
                  quantity: 7,
                  restrictions: {
                    noDeparture: true,
                  },
                },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', undefined);
      });

      it('should not apply noDeparture on a non-last day of trip', () => {
        const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
          availability: {
            availability: {
              rta: {
                '2018-01-03': { date: '2018-01-03', quantity: 7 },
                '2018-01-04': { date: '2018-01-04', quantity: 7 },
                '2018-01-05': {
                  date: '2018-01-05',
                  quantity: 7,
                  restrictions: {
                    noDeparture: true,
                  },
                },
                '2018-01-06': { date: '2018-01-06', quantity: 7 },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', 7);
      });

      it('should apply noArrival and noDeparture at the same time for a single day trip', () => {
        const result = enhancePricingEstimates({
          arrival: '2018-08-31',
          departure: '2018-09-01',
          guestAges: [18],
          helpers: {
            arrivalDateDayjs: dayjs('2018-08-31'),
            departureDateDayjs: dayjs('2018-09-01'),
            lengthOfStay: 1,
            numberOfGuests: 1,
          },
        }, [{ id: 'rta' }], {
          availability: {
            availability: {
              rta: {
                '2018-08-31': {
                  date: '2018-08-31',
                  quantity: 7,
                  restrictions: {
                    noArrival: true,
                  },
                },
                '2018-09-01': {
                  date: '2018-09-01',
                  quantity: 7,
                  restrictions: {
                    noDeparture: true,
                  },
                },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', undefined);
      });
    });

    describe('room type occupancy', () => {
      it('should apply min occupancy', () => {
        const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
          roomTypes: {
            rta: {
              occupancy: {
                min: 3,
              },
            },
          },
          availability: {
            availability: {
              rta: {
                '2018-01-03': { date: '2018-01-03', quantity: 7 },
                '2018-01-04': { date: '2018-01-04', quantity: 7 },
                '2018-01-05': { date: '2018-01-05', quantity: 7 },
                '2018-01-06': { date: '2018-01-06', quantity: 7 },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', undefined);
      });

      it('should apply max occupancy', () => {
        const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
          roomTypes: {
            rta: {
              occupancy: {
                max: 1,
              },
            },
          },
          availability: {
            availability: {
              rta: {
                '2018-01-03': { date: '2018-01-03', quantity: 7 },
                '2018-01-04': { date: '2018-01-04', quantity: 7 },
                '2018-01-05': { date: '2018-01-05', quantity: 7 },
                '2018-01-06': { date: '2018-01-06', quantity: 7 },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', undefined);
      });

      it('should not apply occupancy if numberOfGuests fit', () => {
        const result = enhancePricingEstimates(guestData, [{ id: 'rta' }], {
          roomTypes: {
            rta: {
              occupancy: {
                min: 1,
                max: 4,
              },
            },
          },
          availability: {
            availability: {
              rta: {
                '2018-01-03': { date: '2018-01-03', quantity: 7 },
                '2018-01-04': { date: '2018-01-04', quantity: 7 },
                '2018-01-05': { date: '2018-01-05', quantity: 7 },
                '2018-01-06': { date: '2018-01-06', quantity: 7 },
              },
            },
          },
        });
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('quantity', 7);
      });
    });
  });
});
