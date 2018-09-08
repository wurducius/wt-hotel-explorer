import estimatesActions from '../../src/actions/estimates';

describe('action:estimates', () => {
  describe('recomputeHotelEstimates', () => {
    let dispatchMock;
    let getStateMock;
    let exampleState;
    let action;

    beforeEach(() => {
      dispatchMock = jest.fn();
      getStateMock = jest.fn();
      exampleState = {
        estimates: {
          guestData: {
            arrival: '2018-01-03',
            departure: '2018-01-05',
            numberOfGuests: 1,
          },
        },
        hotels: {
          list: [{
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
          }],
        },
      };
      action = estimatesActions.recomputeHotelEstimates({ id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3' });
    });

    describe('input validation', () => {
      it('should not do anything when hotel does not exist', () => {
        exampleState.hotels.list = [];
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(0);
        expect(getStateMock.mock.calls.length).toBe(1);
      });

      it('should not do anything when hotel does not have roomTypes', () => {
        exampleState.hotels.list = [{
          id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
          ratePlans: {},
        }];
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(0);
        expect(getStateMock.mock.calls.length).toBe(1);
      });

      it('should not do anything when hotel does not have ratePlans', () => {
        exampleState.hotels.list = [{
          id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
          roomTypes: {},
        }];
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(0);
        expect(getStateMock.mock.calls.length).toBe(1);
      });

      it('should not do anything when there are no guest data', () => {
        exampleState.estimates = {};
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(0);
        expect(getStateMock.mock.calls.length).toBe(1);
      });

      it('should not do anything when numberOfGuests is missing', () => {
        exampleState.estimates.guestData = {
          arrival: '2018-01-01',
          departure: '2018-04-01',
        };
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(0);
        expect(getStateMock.mock.calls.length).toBe(1);
      });

      it('should not do anything when arrival is missing', () => {
        exampleState.estimates.guestData = {
          departure: '2018-01-01',
          numberOfGuests: 1,
        };
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(0);
        expect(getStateMock.mock.calls.length).toBe(1);
      });

      it('should not do anything when departure is missing', () => {
        exampleState.estimates.guestData = {
          arrival: '2018-01-01',
          numberOfGuests: 1,
        };
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(0);
        expect(getStateMock.mock.calls.length).toBe(1);
      });
    });

    describe('rate plan computation', () => {
      it('should return null price if no rate plan matches the room type', () => {
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('id', exampleState.hotels.list[0].id);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rta').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rta')).toHaveProperty('price', undefined);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rta')).toHaveProperty('currency', exampleState.hotels.list[0].currency);
      });

      it('should not use a rate plan if it is not available for reservation based on current date', () => {
        // make sure the rate plan for rtb does not work for today
        exampleState.hotels.list[0].ratePlans.rpa.availableForReservation = {
          from: '2015-01-01',
          to: '2015-10-10',
        };
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', undefined);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', exampleState.hotels.list[0].currency);
      });

      it('should not use a rate plan if it is not available for travel based on guest data', () => {
        // make sure the rate plan for rtb does not work for current estimates.guestData
        exampleState.hotels.list[0].ratePlans.rpa.availableForTravel = {
          from: '2015-01-01',
          to: '2015-10-10',
        };
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', undefined);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', exampleState.hotels.list[0].currency);
      });

      it('should return base price if no modifiers are present and only one rate plan fits', () => {
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', 100 * 2);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', exampleState.hotels.list[0].currency);
      });

      it('should override hotel currency if rate plan is more specific', () => {
        exampleState.hotels.list[0].ratePlans.rpa.currency = 'USD';
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', 100 * 2);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', 'USD');
      });

      it('should return the lowest base price if no modifiers are present and multiple rate plans fit', () => {
        exampleState.hotels.list[0].ratePlans.rpb = {
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
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', 60 * 2);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', exampleState.hotels.list[0].currency);
      });

      it('should combine multiple rate plans if the stay range hits both of them', () => {
        exampleState.hotels.list[0].ratePlans.rpa = Object.assign(
          {},
          exampleState.hotels.list[0].ratePlans.rpa, {
            price: 73,
            availableForTravel: {
              from: '2018-10-02',
              to: '2018-10-06',
            },
          },
        );
        exampleState.hotels.list[0].ratePlans.rpb = {
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
        exampleState.estimates.guestData = Object.assign({}, exampleState.estimates.guestData, {
          arrival: '2018-10-02',
          departure: '2018-10-10',
          numberOfGuests: 3,
        });
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', 3 * ((60 * 3) + (73 * 5)));
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', exampleState.hotels.list[0].currency);
      });

      it('should not return an estimate if even a single date of a stay is not covered by a valid rate plan', () => {
        exampleState.hotels.list[0].ratePlans.rpa = Object.assign(
          {},
          exampleState.hotels.list[0].ratePlans.rpa, {
            price: 73,
            availableForTravel: {
              from: '2018-10-02',
              to: '2018-10-04',
            },
          },
        );
        exampleState.hotels.list[0].ratePlans.rpb = {
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
        exampleState.estimates.guestData = Object.assign({}, exampleState.estimates.guestData, {
          arrival: '2018-10-02',
          departure: '2018-10-10',
        });
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', undefined);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', exampleState.hotels.list[0].currency);
      });

      it('should not combine rate plans with different currencies', () => {
        exampleState.hotels.list[0].ratePlans.rpa = Object.assign(
          {},
          exampleState.hotels.list[0].ratePlans.rpa, {
            price: 71,
            availableForTravel: {
              from: '2018-10-02',
              to: '2018-10-06',
            },
            currency: 'EUR',
          },
        );
        exampleState.hotels.list[0].ratePlans.rpb = {
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
        exampleState.hotels.list[0].ratePlans.rpc = {
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
        exampleState.estimates.guestData = Object.assign({}, exampleState.estimates.guestData, {
          arrival: '2018-10-02',
          departure: '2018-10-10',
        });
        getStateMock.mockReturnValue(exampleState);
        action(dispatchMock, getStateMock);
        expect(dispatchMock.mock.calls.length).toBe(1);
        expect(getStateMock.mock.calls.length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload).toHaveProperty('data');
        expect(dispatchMock.mock.calls[0][0].payload.data.filter(e => e.id === 'rtb').length).toBe(1);
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('price', (5 * 71) + (3 * 21));
        expect(dispatchMock.mock.calls[0][0].payload.data.find(e => e.id === 'rtb')).toHaveProperty('currency', 'EUR');
      });


      // TODO guest age and other modifiers
    });
  });
});
