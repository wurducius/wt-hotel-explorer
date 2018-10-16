export function getCurrentByHotelId(state, hotelId) {
  return state.estimates.current[hotelId];
}

export function getCurrent(state) {
  return state.estimates.current;
}

export default {
  getCurrentByHotelId,
  getCurrent,
};
