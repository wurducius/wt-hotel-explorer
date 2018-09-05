import { createActionThunk } from 'redux-thunk-actions';

const LIMIT = 5;

const LIST_FIELDS = [
  'id',
  'name',
  'description',
  'location',
  'images',
];

const fetchHotelsData = createActionThunk('FETCH_LIST', ({ getState }) => {
  let url = `${process.env.WT_READ_API}/hotels?fields=${LIST_FIELDS.join(',')}&limit=${LIMIT}`;
  const state = getState();
  if (state.hotels.next) {
    url = state.hotels.next;
  }
  return fetch(url).then(data => data.json());
});

const DETAIL_FIELDS = [
  'roomTypes',
  'location',
  'name',
  'description',
  'contacts',
  'address',
  'images',
  'amenities',
  'defaultCancellationAmount',
  'cancellationPolicies',
];

const fetchHotelDetail = createActionThunk('FETCH_DETAIL', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}?fields=${DETAIL_FIELDS.join(',')}`;
  return fetch(url).then(data => data.json());
});

const actions = {
  fetchHotelsData,
  fetchHotelDetail,
};

export default actions;
