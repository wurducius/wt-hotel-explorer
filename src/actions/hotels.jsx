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
  'id',
  'name',
  'description',
  'location',
  'images',
  'contacts',
  'address',
  'amenities',
  'defaultCancellationAmount',
  'cancellationPolicies',
  'roomTypes',
];

const fetchHotelDetail = createActionThunk('FETCH_DETAIL', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}?fields=${DETAIL_FIELDS.join(',')}`;
  return fetch(url).then(data => data.json());
});

const fetchHotelRatePlans = createActionThunk('FETCH_HOTEL_RATE_PLANS', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/ratePlans`;
  return fetch(url)
    .then(data => data.json())
    .then(data => ({
      data,
      id,
    }));
});

const fetchHotelRoomTypes = createActionThunk('FETCH_HOTEL_ROOM_TYPES', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/roomTypes`;
  return fetch(url)
    .then(data => data.json())
    .then(data => ({
      data,
      id,
    }));
});

const actions = {
  fetchHotelsData,
  fetchHotelDetail,
  fetchHotelRatePlans,
  fetchHotelRoomTypes,
};

export default actions;
