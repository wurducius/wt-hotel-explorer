import { createActionThunk } from 'redux-thunk-actions';

const LIMIT = 5;

const fetchHotelsData = createActionThunk('FETCH_LIST', ({ getState }) => {
  let url = `${process.env.WT_READ_API}/hotels?fields=id,name,description,location,images&limit=${LIMIT}`;
  const state = getState();
  if (state.hotels.next) {
    url = state.hotels.next;
  }
  return fetch(url).then(data => data.json());
});

const fetchHotelDetail = createActionThunk('FETCH_DETAIL', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}`;
  return fetch(url).then(data => data.json());
});

const actions = {
  fetchHotelsData,
  fetchHotelDetail,
};

export default actions;
