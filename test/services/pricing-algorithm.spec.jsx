import dayjs from 'dayjs';
import currency from 'currency.js';
import pricingAlgorithm from '../../src/services/pricing-algorithm';

describe('services.pricing-algorithm', () => {
  let guestData;
  let hotel;

  beforeEach(() => {
    guestData = {
      arrival: '2018-01-03',
      departure: '2018-01-05',
      guestAges: [18],
      helpers: {
        arrivalDateDayjs: dayjs('2018-01-03'),
        departureDateDayjs: dayjs('2018-01-05'),
        lengthOfStay: 2,
        numberOfGuests: 1,
      },
    };
    hotel = {
      id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
      currency: 'CZK',
      ratePlans: {
        rpa: {
          id: 'rpa',
          price: 100,
          roomTypeIds: ['rtb'],
          availableForReservation: {
            from: '2018-01-01',
            to: '2020-12-31',
          },
          availableForTravel: {
            from: '2016-06-01',
            to: '2020-12-31',
          },
        },
      },
      roomTypes: {
        rta: { id: 'rta' },
        rtb: { id: 'rtb' },
      },
    };
  });


  describe('computePrices', () => {
    // TODO multiple currencies
    it('should return null price if no rate plan matches the room type', () => {
      const result = pricingAlgorithm.computePrices(hotel, guestData);
      expect(result.find(e => e.id === 'rta')).toHaveProperty('price', undefined);
      expect(result.find(e => e.id === 'rta')).toHaveProperty('currency', hotel.currency);
    });
  });

  describe('getApplicableRatePlansFor', () => {
    it('should not use a rate plan if it is not available for reservation based on current date', () => {
      // make sure the rate plan for rtb does not work for today
      hotel.ratePlans.rpa.availableForReservation = {
        from: '2015-01-01',
        to: '2015-10-10',
      };
      const result = pricingAlgorithm.getApplicableRatePlansFor(
        hotel.roomTypes.rtb,
        guestData,
        [hotel.ratePlans.rpa],
      );
      expect(result.length).toBe(0);
    });

    it('should not use a rate plan if it is not available for travel based on guest data', () => {
      // make sure the rate plan for rtb does not work for current estimates.guestData
      hotel.ratePlans.rpa.availableForTravel = {
        from: '2015-01-01',
        to: '2015-10-10',
      };
      const result = pricingAlgorithm.getApplicableRatePlansFor(
        hotel.roomTypes.rtb,
        guestData,
        [hotel.ratePlans.rpa],
      );
      expect(result.length).toBe(0);
    });

    it('should return the only fitting rate plan', () => {
      const result = pricingAlgorithm.getApplicableRatePlansFor(
        hotel.roomTypes.rtb,
        guestData,
        [hotel.ratePlans.rpa],
      );
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('price', 100);
    });

    it('should return multiple fitting rate plans', () => {
      hotel.ratePlans.rpb = {
        id: 'rpb',
        price: 60,
        roomTypeIds: ['rtb'],
        availableForReservation: {
          from: '2018-01-01',
          to: '2020-12-31',
        },
        availableForTravel: {
          from: '2016-06-01',
          to: '2020-09-30',
        },
      };
      const result = pricingAlgorithm.getApplicableRatePlansFor(
        hotel.roomTypes.rtb,
        guestData,
        Object.values(hotel.ratePlans),
      );
      expect(result.length).toBe(2);
    });

    describe('restrictions', () => {
      let currentGuestData;
      let ratePlans;
      let today;

      beforeEach(() => {
        today = dayjs();
        currentGuestData = {
          arrival: dayjs(today).add(5, 'days').format('YYYY-MM-DD'),
          departure: dayjs(today).add(7, 'days').format('YYYY-MM-DD'),
          guestAges: [18],
          helpers: {
            arrivalDateDayjs: dayjs(today).add(5, 'days'),
            departureDateDayjs: dayjs(today).add(7, 'days'),
            lengthOfStay: 2,
            numberOfGuests: 1,
          },
        };
        ratePlans = [
          {
            id: 'rpb',
            price: 60,
            roomTypeIds: ['rtb'],
            availableForReservation: {
              from: dayjs(today).subtract(20, 'days').format('YYYY-MM-DD'),
              to: dayjs(today).add(20, 'days').format('YYYY-MM-DD'),
            },
            availableForTravel: {
              from: dayjs(today).subtract(20, 'days').format('YYYY-MM-DD'),
              to: dayjs(today).add(20, 'days').format('YYYY-MM-DD'),
            },
          },
          {
            id: 'rpc',
            price: 100,
            roomTypeIds: ['rtb'],
            availableForReservation: {
              from: dayjs(today).subtract(20, 'days').format('YYYY-MM-DD'),
              to: dayjs(today).add(20, 'days').format('YYYY-MM-DD'),
            },
            availableForTravel: {
              from: dayjs(today).subtract(20, 'days').format('YYYY-MM-DD'),
              to: dayjs(today).add(20, 'days').format('YYYY-MM-DD'),
            },
          },
        ];
      });

      describe('bookingCutOff', () => {
        it('should drop rate plan if booking happens after min bookingCutOff', () => {
          ratePlans[0].restrictions = {
            bookingCutOff: {
              min: 20,
            },
          };
          const result = pricingAlgorithm.getApplicableRatePlansFor(
            hotel.roomTypes.rtb,
            currentGuestData,
            ratePlans,
          );
          expect(result.length).toBe(1);
        });

        it('should drop rate plan if booking happens before max bookingCutOff', () => {
          ratePlans[0].restrictions = {
            bookingCutOff: {
              max: 2,
            },
          };
          const result = pricingAlgorithm.getApplicableRatePlansFor(
            hotel.roomTypes.rtb,
            currentGuestData,
            ratePlans,
          );
          expect(result.length).toBe(1);
        });

        it('should keep rate plan if booking happens in the desired cut off interval', () => {
          ratePlans[0].restrictions = {
            bookingCutOff: {
              min: 4,
              max: 8,
            },
          };
          const result = pricingAlgorithm.getApplicableRatePlansFor(
            hotel.roomTypes.rtb,
            currentGuestData,
            ratePlans,
          );
          expect(result.length).toBe(2);
        });
      });


      describe('lengthOfStay', () => {
        it('should drop rate plan if stay does not have min lengthOfStay', () => {
          ratePlans[0].restrictions = {
            lengthOfStay: {
              min: 4,
            },
          };
          const result = pricingAlgorithm.getApplicableRatePlansFor(
            hotel.roomTypes.rtb,
            currentGuestData,
            ratePlans,
          );
          expect(result.length).toBe(1);
        });

        it('should drop rate plan if stay is longer than max lengthOfStay', () => {
          ratePlans[0].restrictions = {
            lengthOfStay: {
              max: 1,
            },
          };
          const result = pricingAlgorithm.getApplicableRatePlansFor(
            hotel.roomTypes.rtb,
            currentGuestData,
            ratePlans,
          );
          expect(result.length).toBe(1);
        });

        it('should keep rate plan if stay is in between the desired lengthOfStay', () => {
          ratePlans[0].restrictions = {
            lengthOfStay: {
              min: 2,
              max: 10,
            },
          };
          const result = pricingAlgorithm.getApplicableRatePlansFor(
            hotel.roomTypes.rtb,
            currentGuestData,
            ratePlans,
          );
          expect(result.length).toBe(2);
        });
      });
    });
  });

  describe('computeDailyPrices', () => {
    it('should return the lowest price if no modifiers are present and multiple rate plans fit', () => {
      hotel.ratePlans.rpb = {
        id: 'rpb',
        price: 60,
        roomTypeIds: ['rtb'],
        availableForReservation: {
          from: '2018-01-01',
          to: '2020-12-31',
        },
        availableForTravel: {
          from: '2016-06-01',
          to: '2020-09-30',
        },
      };

      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        guestData,
        Object.values(hotel.ratePlans),
      );
      expect(result).toHaveProperty(hotel.currency);
      expect(result[hotel.currency].length).toBe(2);
      expect(result[hotel.currency][0].format()).toBe(currency(60).format());
      expect(result[hotel.currency][1].format()).toBe(currency(60).format());
    });

    it('should combine multiple rate plans if the stay range hits both of them', () => {
      hotel.ratePlans.rpa = Object.assign(
        {},
        hotel.ratePlans.rpa, {
          price: 73,
          availableForTravel: {
            from: '2018-10-02',
            to: '2018-10-06',
          },
        },
      );
      hotel.ratePlans.rpb = {
        id: 'rpb',
        price: 60,
        roomTypeIds: ['rtb'],
        availableForReservation: {
          from: '2018-01-01',
          to: '2020-12-31',
        },
        availableForTravel: {
          from: '2018-10-07',
          to: '2018-10-10',
        },
      };
      guestData = Object.assign({}, guestData, {
        arrival: '2018-10-02',
        departure: '2018-10-10',
        guestAges: [10, 20, 30],
        helpers: {
          arrivalDateDayjs: dayjs('2018-10-02'),
          departureDateDayjs: dayjs('2018-10-10'),
          lengthOfStay: 8,
          numberOfGuests: 3,
        },
      });

      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        guestData,
        Object.values(hotel.ratePlans),
      );
      expect(result).toHaveProperty(hotel.currency);
      expect(result[hotel.currency].length).toBe(8);
      expect(result[hotel.currency][0].format()).toBe(currency(3 * 73).format()); // 10-02
      expect(result[hotel.currency][1].format()).toBe(currency(3 * 73).format()); // 10-03
      expect(result[hotel.currency][2].format()).toBe(currency(3 * 73).format()); // 10-04
      expect(result[hotel.currency][3].format()).toBe(currency(3 * 73).format()); // 10-05
      expect(result[hotel.currency][4].format()).toBe(currency(3 * 73).format()); // 10-06
      expect(result[hotel.currency][5].format()).toBe(currency(3 * 60).format()); // 10-07
      expect(result[hotel.currency][6].format()).toBe(currency(3 * 60).format()); // 10-08
      expect(result[hotel.currency][7].format()).toBe(currency(3 * 60).format()); // 10-09
    });

    it('should not return an estimate if even a single date of a stay is not covered by a valid rate plan', () => {
      hotel.ratePlans.rpa = Object.assign(
        {},
        hotel.ratePlans.rpa, {
          price: 73,
          availableForTravel: {
            from: '2018-10-02',
            to: '2018-10-04',
          },
        },
      );
      hotel.ratePlans.rpb = {
        id: 'rpb',
        price: 60,
        roomTypeIds: ['rtb'],
        availableForReservation: {
          from: '2018-01-01',
          to: '2020-12-31',
        },
        availableForTravel: {
          from: '2018-10-07',
          to: '2018-10-10',
        },
      };
      guestData = Object.assign({}, guestData, {
        arrival: '2018-10-02',
        departure: '2018-10-10',
        helpers: {
          arrivalDateDayjs: dayjs('2018-10-02'),
          departureDateDayjs: dayjs('2018-10-10'),
          lengthOfStay: 8,
        },
      });
      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        guestData,
        Object.values(hotel.ratePlans),
      );
      expect(result).not.toHaveProperty(hotel.currency);
    });

    it('should not combine rate plans with different currencies', () => {
      hotel.ratePlans.rpa = Object.assign(
        {},
        hotel.ratePlans.rpa, {
          price: 71,
          availableForTravel: {
            from: '2018-10-02',
            to: '2018-10-06',
          },
          currency: 'EUR',
        },
      );
      hotel.ratePlans.rpb = {
        id: 'rpb',
        price: 17,
        roomTypeIds: ['rtb'],
        availableForReservation: {
          from: '2018-01-01',
          to: '2020-12-31',
        },
        availableForTravel: {
          from: '2018-10-07',
          to: '2018-10-10',
        },
        currency: 'GBP',
      };
      hotel.ratePlans.rpc = {
        id: 'rpb',
        price: 21,
        roomTypeIds: ['rtb'],
        availableForReservation: {
          from: '2018-01-01',
          to: '2020-12-31',
        },
        availableForTravel: {
          from: '2018-10-07',
          to: '2018-10-10',
        },
        currency: 'EUR',
      };
      guestData = Object.assign({}, guestData, {
        arrival: '2018-10-02',
        departure: '2018-10-10',
        helpers: {
          arrivalDateDayjs: dayjs('2018-10-02'),
          departureDateDayjs: dayjs('2018-10-10'),
          lengthOfStay: 8,
          numberOfGuests: 1,
        },
      });

      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        guestData,
        Object.values(hotel.ratePlans),
      );

      expect(result).not.toHaveProperty(hotel.currency);
      expect(result).not.toHaveProperty('GBP');
      expect(result).toHaveProperty('EUR');
      expect(result.EUR[0].format()).toBe(currency(71).format());
      expect(result.EUR[1].format()).toBe(currency(71).format());
      expect(result.EUR[2].format()).toBe(currency(71).format());
      expect(result.EUR[3].format()).toBe(currency(71).format());
      expect(result.EUR[4].format()).toBe(currency(71).format());
      expect(result.EUR[5].format()).toBe(currency(21).format());
      expect(result.EUR[6].format()).toBe(currency(21).format());
      expect(result.EUR[7].format()).toBe(currency(21).format());
    });
  });

  describe('computeDailyPrice', () => {
    describe('modifier selection', () => {
      it('should return base price if rate plan has no modifiers', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { helpers: { numberOfGuests: 1, lengthOfStay: 3 } }, { price: 10 }).format()).toBe(currency(10).format());
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { helpers: { numberOfGuests: 13, lengthOfStay: 3 } }, { price: 10 }).format()).toBe(currency(130).format());
      });

      it('should pick the most pro-customer modifier (all positive)', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: 25, conditions: {} },
            { adjustment: 50, conditions: {} },
          ],
        }).format()).toBe(currency(10).format());
      });

      it('should pick the most pro-customer modifier (all negative)', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: {} },
            { adjustment: -50, conditions: {} },
          ],
        }).format()).toBe(currency(4).format());
      });

      it('should pick the most pro-customer modifier (mixed)', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: {} },
            { adjustment: -10, conditions: {} },
            { adjustment: 13, conditions: {} },
            { adjustment: 50, conditions: {} },
          ],
        }).format()).toBe(currency(6).format());
      });
    });

    describe('time interval from, to', () => {
      it('in an interval', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-01-09',
                to: '2018-09-20',
              },
            },
          ],
        }).format()).toBe(currency(6).format());
      });

      it('starting on a stay date', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-09-12',
                to: '2018-09-20',
              },
            },
          ],
        }).format()).toBe(currency(7.5).format());
      });

      it('ending on a stay date', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-09-10',
                to: '2018-09-12',
              },
            },
          ],
        }).format()).toBe(currency(7.5).format());
      });

      it('does not apply when outside', () => {
        expect(pricingAlgorithm.computeDailyPrice('2017-12-09', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-09-01',
                to: '2018-20-09',
              },
            },
          ],
        }).format()).toBe(currency(10).format());
      });

      it('only from is set and stay date is in', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-09-01',
              },
            },
          ],
        }).format()).toBe(currency(7.5).format());
      });

      it('only from is set and stay date is out', () => {
        expect(pricingAlgorithm.computeDailyPrice('2017-12-09', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-09-01',
              },
            },
          ],
        }).format()).toBe(currency(10).format());
      });

      it('only to is set and stay date is in', () => {
        expect(pricingAlgorithm.computeDailyPrice('2017-12-09', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: 25,
              conditions: {
                to: '2018-09-20',
              },
            },
          ],
        }).format()).toBe(currency(12.5).format());
      });

      it('only to is set and stay date is out', () => {
        expect(pricingAlgorithm.computeDailyPrice('2019-12-09', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                to: '2018-09-20',
              },
            },
          ],
        }).format()).toBe(currency(10).format());
      });
    });

    describe('minLengthOfStay', () => {
      it('should not apply modifier if LOS is shorter', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        }).format()).toBe(currency(8).format());
      });

      it('should apply modifier if LOS is equal', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 3 } },
          ],
        }).format()).toBe(currency(6).format());
      });

      it('should apply modifier if LOS is longer', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 7, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        }).format()).toBe(currency(6).format());
      });

      it('should apply modifier with the biggest applicable LOS', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 7, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
            { adjustment: -10, conditions: { minLengthOfStay: 7 } },
          ],
        }).format()).toBe(currency(7.2).format());
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 7, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -10, conditions: { minLengthOfStay: 7 } },
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        }).format()).toBe(currency(7.2).format());
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 7, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -50, conditions: { minLengthOfStay: 6 } },
            { adjustment: -10, conditions: { minLengthOfStay: 7 } },
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        }).format()).toBe(currency(7.2).format());
      });
    });

    describe('minOccupants', () => {
      it('should not apply modifier if number of guests is smaller', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 5 } },
          ],
        }).format()).toBe(currency(8 * 1).format());
      });

      it('should apply modifier if number of guests is equal', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [10, 20, 30], helpers: { lengthOfStay: 3, numberOfGuests: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 3 } },
          ],
        }).format()).toBe(currency(6 * 3).format());
      });

      it('should apply modifier if number of guests is larger', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18], helpers: { lengthOfStay: 3, numberOfGuests: 10 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 5 } },
          ],
        }).format()).toBe(currency(6 * 10).format());
      });

      it('should apply modifier with the biggest applicable minOccupants', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [10, 11, 12, 13, 14, 15, 16], helpers: { lengthOfStay: 3, numberOfGuests: 7 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 5 } },
            { adjustment: -10, conditions: { minOccupants: 7 } },
          ],
        }).format()).toBe(currency(7.2 * 7).format());
      });
    });

    describe('maxAge', () => {
      it('should not apply modifier to any guest over the limit', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [11, 18, 30], helpers: { lengthOfStay: 3, numberOfGuests: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { maxAge: 10 } },
          ],
        }).format()).toBe(currency(8 * 3).format());
      });

      it('should apply modifier to all guests under the limit', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [11, 18, 30], helpers: { lengthOfStay: 3, numberOfGuests: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { maxAge: 31 } },
          ],
        }).format()).toBe(currency(6 * 3).format());
      });

      it('should apply modifier to some of the guests if they are under or on par with the limit', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [11, 18, 30], helpers: { lengthOfStay: 3, numberOfGuests: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { maxAge: 18 } },
          ],
        }).format()).toBe(currency(8 * 1 + 6 * 2).format());
      });

      it('should apply modifier with the highest fitting limit', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [25], helpers: { lengthOfStay: 3, numberOfGuests: 1 } }, {
          price: 8,
          modifiers: [
            { adjustment: -10, conditions: { maxAge: 25 } },
            { adjustment: -50, conditions: { maxAge: 18 } },
            { adjustment: -25, conditions: { maxAge: 16 } },
          ],
        }).format()).toBe(currency(7.2).format());
      });

      it('should apply a fitting modifier to each guests', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [25, 18, 16], helpers: { lengthOfStay: 3, numberOfGuests: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -10, conditions: { maxAge: 25 } },
            { adjustment: -50, conditions: { maxAge: 18 } },
            { adjustment: -25, conditions: { maxAge: 16 } },
          ],
        }).format()).toBe(currency(7.2 + 4 + 6).format());
      });

      it('should apply a fitting modifier with best adjustment', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18, 16], helpers: { lengthOfStay: 3, numberOfGuests: 2 } }, {
          price: 8,
          modifiers: [
            { adjustment: -75, conditions: { maxAge: 18 } },
            { adjustment: -25, conditions: { maxAge: 16 } },
            { adjustment: -50, conditions: { maxAge: 18 } },
            { adjustment: -10, conditions: { maxAge: 16 } },
          ],
        }).format()).toBe(currency(2 + 6).format());
      });
    });

    describe('modifier combinations', () => {
      it('should pick the modifier with the best price if multiple are applicable', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18, 16], helpers: { lengthOfStay: 3, numberOfGuests: 2 } }, {
          price: 8,
          modifiers: [
            { adjustment: -75, conditions: { minOccupants: 2 } },
            { adjustment: -50, conditions: { lengthOfStay: 3 } },
          ],
        }).format()).toBe(currency(2 * 2).format());
      });

      it('should pick the guest-specific modifier if multiple are applicable', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18, 16], helpers: { lengthOfStay: 3, numberOfGuests: 2 } }, {
          price: 10,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 2 } },
            { adjustment: -10, conditions: { lengthOfStay: 3 } },
            { adjustment: -20, conditions: { maxAge: 16 } },
          ],
        }).format()).toBe(currency(8 + 7.5).format());
      });

      it('combine maxAge + minOccupants', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18, 16], helpers: { lengthOfStay: 3, numberOfGuests: 2 } }, {
          price: 10,
          modifiers: [
            { adjustment: -20, conditions: { minOccupants: 2, maxAge: 16 } },
            { adjustment: -25, conditions: { minOccupants: 3, maxAge: 16 } },
          ],
        }).format()).toBe(currency(10 + 8).format());
      });

      it('combine maxAge + lengthOfStay', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18, 16], helpers: { lengthOfStay: 3, numberOfGuests: 2 } }, {
          price: 10,
          modifiers: [
            { adjustment: -20, conditions: { lengthOfStay: 2, maxAge: 16 } },
            { adjustment: -25, conditions: { lengthOfStay: 3, maxAge: 16 } },
          ],
        }).format()).toBe(currency(10 + 7.5).format());
      });

      it('combine maxAge + lengthOfStay + minOccupants', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { guestAges: [18, 16], helpers: { lengthOfStay: 3, numberOfGuests: 2 } }, {
          price: 10,
          modifiers: [
            { adjustment: -10, conditions: { lengthOfStay: 2, minOccupants: 2, maxAge: 16 } },
            { adjustment: -20, conditions: { lengthOfStay: 3, minOccupants: 3, maxAge: 16 } },
            { adjustment: -30, conditions: { lengthOfStay: 3, minOccupants: 2, maxAge: 16 } },
            { adjustment: -40, conditions: { lengthOfStay: 2, minOccupants: 3, maxAge: 16 } },
          ],
        }).format()).toBe(currency(10 + 7).format());
      });
    });
  });
});
