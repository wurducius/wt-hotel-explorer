export function getCurrentByHotelId(state, hotelId) {
  return state.estimates.current[hotelId];
}

export function getCurrent(state) {
  return state.estimates.current;
}

export function getGuestData(state) {
  return state.estimates.guestData;
}
