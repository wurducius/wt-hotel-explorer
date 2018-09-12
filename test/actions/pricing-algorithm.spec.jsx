import moment from 'moment';
import pricingAlgorithm from '../../src/actions/pricing-algorithm';

describe.only('action.pricing-algorithm', () => {
  let guestData;
  let hotel;

  beforeEach(() => {
    guestData = {
      arrival: '2018-01-03',
      departure: '2018-01-05',
      numberOfGuests: 1,
      helpers: {
        arrivalDateMoment: moment.utc('2018-01-03'),
        departureDateMoment: moment.utc('2018-01-05'),
        lengthOfStay: 2,
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
    // TODO should compute daily prices
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
      expect(result[hotel.currency][0]).toBe(60);
      expect(result[hotel.currency][1]).toBe(60);
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
        numberOfGuests: 3,
        helpers: {
          arrivalDateMoment: moment.utc('2018-10-02'),
          departureDateMoment: moment.utc('2018-10-10'),
          lengthOfStay: 8,
        },
      });

      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        guestData,
        Object.values(hotel.ratePlans),
      );
      expect(result).toHaveProperty(hotel.currency);
      expect(result[hotel.currency].length).toBe(8);
      expect(result[hotel.currency][0]).toBe(3 * 73); // 10-02
      expect(result[hotel.currency][1]).toBe(3 * 73); // 10-03
      expect(result[hotel.currency][2]).toBe(3 * 73); // 10-04
      expect(result[hotel.currency][3]).toBe(3 * 73); // 10-05
      expect(result[hotel.currency][4]).toBe(3 * 73); // 10-06
      expect(result[hotel.currency][5]).toBe(3 * 60); // 10-07
      expect(result[hotel.currency][6]).toBe(3 * 60); // 10-08
      expect(result[hotel.currency][7]).toBe(3 * 60); // 10-09
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
          arrivalDateMoment: moment.utc('2018-10-02'),
          departureDateMoment: moment.utc('2018-10-10'),
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
          arrivalDateMoment: moment.utc('2018-10-02'),
          departureDateMoment: moment.utc('2018-10-10'),
          lengthOfStay: 8,
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
      expect(result.EUR[0]).toBe(71);
      expect(result.EUR[1]).toBe(71);
      expect(result.EUR[2]).toBe(71);
      expect(result.EUR[3]).toBe(71);
      expect(result.EUR[4]).toBe(71);
      expect(result.EUR[5]).toBe(21);
      expect(result.EUR[6]).toBe(21);
      expect(result.EUR[7]).toBe(21);
    });
  });

  describe('computeDailyPrice', () => {
    describe('modifier selection', () => {
      it('should return base price if rate plan has no modifiers', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, { price: 10 })).toBe(10);
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 71, helpers: { lengthOfStay: 3 } }, { price: 10 })).toBe(710);
      });

      it('should pick the most pro-customer modifier (all positive)', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: 25, conditions: {} },
            { adjustment: 50, conditions: {} },
          ],
        })).toBe(10);
      });

      it('should pick the most pro-customer modifier (all negative)', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: {} },
            { adjustment: -50, conditions: {} },
          ],
        })).toBe(4);
      });

      it('should pick the most pro-customer modifier (mixed)', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: {} },
            { adjustment: -10, conditions: {} },
            { adjustment: 13, conditions: {} },
            { adjustment: 50, conditions: {} },
          ],
        })).toBe(6);
      });
    });

    describe('time interval from, to', () => {
      it('in an interval', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
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
        })).toBe(6);
      });

      it('starting on a stay date', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
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
        })).toBe(7.5);
      });

      it('ending on a stay date', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
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
        })).toBe(7.5);
      });

      it('does not apply when outside', () => {
        expect(pricingAlgorithm.computeDailyPrice('2017-12-09', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
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
        })).toBe(10);
      });

      it('only from is set and stay date is in', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-09-01',
              },
            },
          ],
        })).toBe(7.5);
      });

      it('only from is set and stay date is out', () => {
        expect(pricingAlgorithm.computeDailyPrice('2017-12-09', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                from: '2018-09-01',
              },
            },
          ],
        })).toBe(10);
      });

      it('only to is set and stay date is in', () => {
        expect(pricingAlgorithm.computeDailyPrice('2017-12-09', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: 25,
              conditions: {
                to: '2018-09-20',
              },
            },
          ],
        })).toBe(12.5);
      });

      it('only to is set and stay date is out', () => {
        expect(pricingAlgorithm.computeDailyPrice('2019-12-09', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 10,
          modifiers: [
            {
              adjustment: -25,
              conditions: {
                to: '2018-09-20',
              },
            },
          ],
        })).toBe(10);
      });
    });

    describe('minLengthOfStay', () => {
      it('should not apply modifier if LOS is shorter', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        })).toBe(8);
      });

      it('should apply modifier if LOS is equal', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 3 } },
          ],
        })).toBe(6);
      });

      it('should apply modifier if LOS is longer', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 7 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        })).toBe(6);
      });

      it('should apply modifier with the biggest applicable LOS', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 7 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
            { adjustment: -10, conditions: { minLengthOfStay: 7 } },
          ],
        })).toBe(7.2);
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 7 } }, {
          price: 8,
          modifiers: [
            { adjustment: -10, conditions: { minLengthOfStay: 7 } },
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        })).toBe(7.2);
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 7 } }, {
          price: 8,
          modifiers: [
            { adjustment: -50, conditions: { minLengthOfStay: 6 } },
            { adjustment: -10, conditions: { minLengthOfStay: 7 } },
            { adjustment: -25, conditions: { minLengthOfStay: 5 } },
          ],
        })).toBe(7.2);
      });
    });

    describe('minOccupants', () => {
      it('should not apply modifier if number of guests is smaller', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 1, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 5 } },
          ],
        })).toBe(8 * 1);
      });

      it('should apply modifier if number of guests is equal', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 3, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 3 } },
          ],
        })).toBe(6 * 3);
      });

      it('should apply modifier if number of guests is larger', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 10, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 5 } },
          ],
        })).toBe(6 * 10);
      });

      it('should apply modifier with the biggest applicable minOccupants', () => {
        expect(pricingAlgorithm.computeDailyPrice('2018-09-12', { numberOfGuests: 7, helpers: { lengthOfStay: 3 } }, {
          price: 8,
          modifiers: [
            { adjustment: -25, conditions: { minOccupants: 5 } },
            { adjustment: -10, conditions: { minOccupants: 7 } },
          ],
        })).toBe(7.2 * 7);
      });
    });

    // TODO describe('maxAge', () => {});


    /*
maxAge  integer
The modifier is applicable to occupants of this age or younger at the time
of arrival to the stay. If multiple modifiers are specified with different
maxAge, the modifier with the highest fitting limit is applied.
*/
  });
});
