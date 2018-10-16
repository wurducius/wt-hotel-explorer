import selectors from '../../src/selectors/index';

describe('selectors.estimates', () => {
  let state;
  beforeEach(() => {
    state = {
      estimates: {
        current: { 1: [{ price: 200 }] },
      },
    };
  });
  it('getCurrentByHotelId', () => {
    expect(selectors.estimates.getCurrentByHotelId(state, 1)).toEqual([{ price: 200 }]);
  });
  it('getCurrent', () => {
    expect(selectors.estimates.getCurrent(state)).toEqual({ 1: [{ price: 200 }] });
  });
});
