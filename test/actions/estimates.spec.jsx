import estimatesActions from '../../src/actions/estimates';

describe('action:estimates', () => {
  describe('recomputeHotelEstimates', () => {
    let dispatchMock;
    let getStateMock;
    let exampleState;

    beforeEach(() => {
      dispatchMock = jest.fn();
      getStateMock = jest.fn();
      exampleState = {
        estimates: {
          arrival: '2018-01-01',
          departure: '2018-04-01',
          numberOfGuests: 2,
        },
        hotels: {
          list: [{
            id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
            ratePlans: [],
            roomTypes: [],
          }],
        },
      };
    });

    it('should not do anything when hotel does not exist', () => {
      const action = estimatesActions.recomputeHotelEstimates('0x933198455e38925bccb4bfe9fb59bac31d00b4d3');
      exampleState.hotels.list = [];
      getStateMock.mockReturnValue(exampleState);
      const returnValue = action(dispatchMock, getStateMock);
      expect(returnValue).toBe(undefined);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when hotel does not have roomTypes', () => {
      const action = estimatesActions.recomputeHotelEstimates('0x933198455e38925bccb4bfe9fb59bac31d00b4d3');
      exampleState.hotels.list = [{
        id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
        ratePlans: [],
      }];
      getStateMock.mockReturnValue(exampleState);
      const returnValue = action(dispatchMock, getStateMock);
      expect(returnValue).toBe(undefined);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when hotel does not have ratePlans', () => {
      const action = estimatesActions.recomputeHotelEstimates('0x933198455e38925bccb4bfe9fb59bac31d00b4d3');
      exampleState.hotels.list = [{
        id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
        roomTypes: [],
      }];
      getStateMock.mockReturnValue(exampleState);
      const returnValue = action(dispatchMock, getStateMock);
      expect(returnValue).toBe(undefined);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when there are no guest data', () => {
      const action = estimatesActions.recomputeHotelEstimates('0x933198455e38925bccb4bfe9fb59bac31d00b4d3');
      exampleState.estimates = {};
      getStateMock.mockReturnValue(exampleState);
      const returnValue = action(dispatchMock, getStateMock);
      expect(returnValue).toBe(undefined);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when numberOfGuests is missing', () => {
      const action = estimatesActions.recomputeHotelEstimates('0x933198455e38925bccb4bfe9fb59bac31d00b4d3');
      exampleState.estimates.guestData = {
        arrival: '2018-01-01',
        arrival: '2018-04-01',
      };
      getStateMock.mockReturnValue(exampleState);
      const returnValue = action(dispatchMock, getStateMock);
      expect(returnValue).toBe(undefined);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when arrival is missing', () => {
      const action = estimatesActions.recomputeHotelEstimates('0x933198455e38925bccb4bfe9fb59bac31d00b4d3');
      exampleState.estimates.guestData = {
        departure: '2018-01-01',
        numberOfGuests: 1
      };
      getStateMock.mockReturnValue(exampleState);
      const returnValue = action(dispatchMock, getStateMock);
      expect(returnValue).toBe(undefined);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when departure is missing', () => {
      const action = estimatesActions.recomputeHotelEstimates('0x933198455e38925bccb4bfe9fb59bac31d00b4d3');
      exampleState.estimates.guestData = {
        arrival: '2018-01-01',
        numberOfGuests: 1
      };
      getStateMock.mockReturnValue(exampleState);
      const returnValue = action(dispatchMock, getStateMock);
      expect(returnValue).toBe(undefined);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });
  });
});
