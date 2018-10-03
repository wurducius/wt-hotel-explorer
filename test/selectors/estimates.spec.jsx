import selectors from '../../src/selectors/index';

describe('selectors.estimates', () => {
  let state;
  beforeEach(() => {
    state = {
      estimates: {
        current: { 1: [{ price: 200 }] },
        guestData: {
          arrival: '2018-01-01',
          departure: '2018-04-01',
        },
      },
    };
  });
  it('getCurrentByHotelId', () => {
    expect(selectors.estimates.getCurrentByHotelId(state, 1)).toEqual([{ price: 200 }]);
  });
  it('getCurrent', () => {
    expect(selectors.estimates.getCurrent(state)).toEqual({ 1: [{ price: 200 }] });
  });
  it('getGuestData', () => {
    expect(selectors.estimates.getGuestData(state)).toEqual({ arrival: '2018-01-01', departure: '2018-04-01' });
  });
});
