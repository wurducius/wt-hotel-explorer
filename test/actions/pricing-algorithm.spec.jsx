import moment from 'moment';
import pricingAlgorithm from '../../src/actions/pricing-algorithm';

describe('action.pricing-algorithm', () => {
  let guestData;
  let hotel;

  beforeEach(() => {
    guestData = {
      arrival: '2018-01-03',
      departure: '2018-01-05',
      numberOfGuests: 1,
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
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
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
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
        [hotel.ratePlans.rpa],
      );
      expect(result.length).toBe(0);
    });

    it('should return the only fitting rate plan', () => {
      const result = pricingAlgorithm.getApplicableRatePlansFor(
        hotel.roomTypes.rtb,
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
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
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
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
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
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
      });

      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
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
      });
      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
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
      });

      const result = pricingAlgorithm.computeDailyPrices(
        hotel.currency,
        moment.utc(guestData.arrival),
        moment.utc(guestData.departure),
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
// TODO guest age and other modifiers
});
