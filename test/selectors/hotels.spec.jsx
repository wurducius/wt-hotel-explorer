import selectors from '../../src/selectors/index';

describe('selectors.hotels', () => {
  const reducer = (state, action) => (
    {
      ...state,
      hotels: {
        list: action(state),
      },
    }
  );
  const addOne = (state) => {
    const { list } = state.hotels;
    return [...list, { id: list[list.length - 1].id + 1, name: 'addedHotel' }];
  };
  const updateHotelById = id => (state) => {
    const { list } = state.hotels;
    const hotel = list.find(h => h.id === id);
    const rest = list.filter(h => h.id !== id);
    return [...rest, { ...hotel, name: 'updatedHotel' }];
  };
  const identity = state => state.hotels.list;
  let state;
  beforeEach(() => {
    state = {
      hotels: {
        list: [{ id: 1, name: 'someHotel' }],
        next: 'urlToNext',
        hotelsInitialized: false,
        hotelsLoading: true,
      },
    };
  });
  it('getHotelsWithName', () => {
    expect(selectors.hotels.getHotelsWithName(state)).toEqual([{ id: 1, name: 'someHotel' }]);
    state = reducer(state, identity);
    expect(selectors.hotels.getHotelsWithName(state)).toEqual([{ id: 1, name: 'someHotel' }]);
    expect(selectors.hotels.getHotelsWithName.recomputations()).toEqual(1);
    state = reducer(state, addOne);
    expect(selectors.hotels.getHotelsWithName(state)).toEqual([{ id: 1, name: 'someHotel' }, { id: 2, name: 'addedHotel' }]);
    expect(selectors.hotels.getHotelsWithName.recomputations()).toEqual(2);
  });
  it('makeGetHotelById', () => {
    const getHotelById = selectors.hotels.makeGetHotelById();
    expect(getHotelById(state, 1)).toEqual({ id: 1, name: 'someHotel' });
    state = reducer(state, identity);
    expect(getHotelById(state, 1)).toEqual({ id: 1, name: 'someHotel' });
    expect(getHotelById.recomputations()).toEqual(1);
    const updater = updateHotelById(1);
    state = reducer(state, updater);
    expect(getHotelById(state, 1)).toEqual({ id: 1, name: 'updatedHotel' });
    expect(getHotelById.recomputations()).toEqual(2);
  });
  it('getHotels', () => {
    expect(selectors.hotels.getHotels(state)).toEqual([{ id: 1, name: 'someHotel' }]);
  });
  it('getNextHotel', () => {
    expect(selectors.hotels.getNextHotel(state)).toEqual('urlToNext');
  });
  it('areHotelsInitialized', () => {
    expect(selectors.hotels.areHotelsInitialized(state)).toEqual(false);
  });
  it('isLoadingMore', () => {
    expect(selectors.hotels.isLoadingMore(state)).toEqual(true);
  });
});
