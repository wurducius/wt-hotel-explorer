import { createActionThunk } from 'redux-thunk-actions';

import {
  HttpError,
  Http404Error,
  HttpBadRequestError,
  HttpInternalServerError,
  HttpBadGatewayError,
} from '../services/errors';

const LIMIT = 5;

const LIST_FIELDS = [
  'id',
  'name',
  'description',
  'location',
  'images',
];

const translateNetworkError = (status, code, message) => {
  if (status === 400) {
    return new HttpBadRequestError(code, message);
  }
  // Consider 422 as a 404
  if (status === 404 || status === 422) {
    return new Http404Error(code, message);
  }
  if (status === 502) {
    return new HttpBadGatewayError(code, message);
  }
  if (status === 500) {
    return new HttpInternalServerError(code, message);
  }

  const e = new HttpError(code, message);
  e.status = status;
  return e;
};

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
  return fetch(url).then((response) => {
    if (response.status > 299) {
      throw translateNetworkError(response.status, 'missingHotel', 'Cannot get hotel detail!');
    }
    return response.json();
  });
});

const fetchHotelRatePlans = createActionThunk('FETCH_HOTEL_RATE_PLANS', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/ratePlans`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, 'missingHotel', 'Cannot get hotel detail!');
      }
      return response.json();
    })
    .then(data => ({
      data,
      id,
    }));
});

const fetchHotelRoomTypes = createActionThunk('FETCH_HOTEL_ROOM_TYPES', ({ id }) => {
  const url = `${process.env.WT_READ_API}/hotels/${id}/roomTypes`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, 'missingHotel', 'Cannot get hotel detail!');
      }
      return response.json();
    })
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
