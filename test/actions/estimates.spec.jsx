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
            arrival: '2018-01-01',
            departure: '2018-04-01',
            numberOfGuests: 2,
          },
        },
        hotels: {
          list: [{
            id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
            currency: 'CZK',
            ratePlans: {
              rpa: {
                id: 'rpa',
                roomTypeIds: [],
              },
            },
            roomTypes: {
              rta: {
                id: 'rta',
              },
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
    });
  });
});
