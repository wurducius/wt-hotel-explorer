import selectors from '../../src/selectors/index';

describe('selectors.booking', () => {
  let state;
  beforeEach(() => {
    state = {
      booking: {
        guest: {
          arrival: '2018-01-01',
          departure: '2018-04-01',
        },
      },
    };
  });
  it('getGuestData', () => {
    expect(selectors.booking.getGuestData(state)).toEqual({ arrival: '2018-01-01', departure: '2018-04-01' });
  });
});
