import reducer from '../../src/reducers/hotels';

describe('reducers.hotels', () => {
  const initialState = {
    erroredHotels: { 1: 'fresh' },
    list: [],
    hotelsInitialized: false,
    hotelsLoading: false,
    next: null,
  };
  it('should handle REFETCH_ERRORED_HOTEL_STARTED', () => {
    const action = {
      type: 'REFETCH_ERRORED_HOTEL_STARTED',
      payload: {
        id: 1,
      },
    };
    const state = {
      ...initialState,
      erroredHotels: {
        1: 'fresh',
      },
    };
    expect(reducer(state, action)).toHaveProperty('erroredHotels', { 1: 'in-progress' });
  });
  it('should handle FETCH_LIST_STARTED', () => {
    const action = {
      type: 'FETCH_LIST_STARTED',
    };
    const state = {
      ...initialState,
      hotelsLoading: false,
    };
    expect(reducer(state, action)).toHaveProperty('hotelsLoading', true);
  });
  it('should handle FETCH_LIST_SUCCEEDED with errors', () => {
    const action = {
      type: 'FETCH_LIST_SUCCEEDED',
      payload: {
        errors: [{ data: { id: 1 } }],
      },
    };
    const state = initialState;
    expect(reducer(state, action)).toHaveProperty('erroredHotels', { 1: 'fresh' });
  });
  it('should handle FETCH_LIST_SUCCEEDED with items', () => {
    const action = {
      type: 'FETCH_LIST_SUCCEEDED',
      payload: {
        items: [{ id: 1 }],
        next: 'nextItem',
      },
    };
    const state = {
      ...initialState,
      erroredHotels: { 1: 'fresh' },
    };
    const expectedList = [{ id: 1, hasDetailLoaded: false, hasDetailLoading: false }];
    expect(reducer(state, action)).toHaveProperty('list', expectedList);
    expect(reducer(state, action)).toHaveProperty('next', 'nextItem');
    expect(reducer(state, action)).toHaveProperty('erroredHotels', {});
  });
  it('should handle FETCH_DETAIL_STARTED with a new hotel', () => {
    const action = {
      type: 'FETCH_DETAIL_STARTED',
      payload: [{ id: 1 }],
    };
    const state = {
      ...initialState,
    };
    const expected = [{ id: 1, hasDetailLoaded: false, hasDetailLoading: true }];
    expect(reducer(state, action)).toHaveProperty('list', expected);
  });
  it('should handle FETCH_DETAIL_SUCCEEDED with existing hotel', () => {
    const action = {
      type: 'FETCH_DETAIL_SUCCEEDED',
      payload: { id: 1 },
    };
    const state = {
      ...initialState,
      list: [{ id: 1 }],
    };

    const expected = [{
      id: 1,
      hasDetailLoaded: true,
      hasDetailLoading: false,
    }];
    expect(reducer(state, action)).toHaveProperty('list', expected);
  });
});
