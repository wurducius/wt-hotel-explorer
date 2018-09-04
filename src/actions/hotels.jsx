import { createActionThunk } from 'redux-thunk-actions';

const LIMIT = 5;

const fetchHotelsData = createActionThunk('FETCH', ({ getState }) => {
  let url = `${process.env.WT_READ_API}/hotels?fields=id,name,description,location,images&limit=${LIMIT}`;
  const state = getState();
  if (state.hotels.next) {
    url = state.hotels.next;
  }
  return fetch(url).then(data => data.json());
});

const actions = {
  fetchHotelsData,
};

export default actions;
