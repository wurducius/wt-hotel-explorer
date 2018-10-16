export function getGuestData(state) {
  return state.booking.guest;
}

export function getHotelData(state) {
  return state.booking.hotel;
}

export default {
  getGuestData,
  getHotelData,
};
