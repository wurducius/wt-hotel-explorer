import { createSelector } from 'reselect';

export function getHotels(state) {
  return state.hotels.list;
}

export function getNextHotel(state) {
  return state.hotels.next;
}

export function areHotelsInitialized(state) {
  return state.hotels.hotelsInitialized;
}

export function isLoadingMore(state) {
  return state.hotels.hotelsLoading;
}

export const getHotelsWithName = createSelector(
  getHotels,
  hotels => hotels.filter(h => !!h.name),
);

function getId(state, id) {
  return id;
}

export function makeGetHotelById() {
  return createSelector(
    [getHotels, getId],
    (hotels, id) => hotels.find(hotel => hotel.id === id),
  );
}

export default {
  getHotels,
  getNextHotel,
  areHotelsInitialized,
  isLoadingMore,
  getHotelsWithName,
  makeGetHotelById,
};
