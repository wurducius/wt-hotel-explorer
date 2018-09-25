import dayjs from 'dayjs';

export const enhancePricingEstimates = (guestData, pricingData, hotel) => {
  if (!hotel.availability || !hotel.availability.availability) {
    return pricingData;
  }
  const result = [].concat(pricingData);
  for (let i = 0; i < pricingData.length; i += 1) {
    const indexedAvailability = hotel.availability.availability[pricingData[i].id];
    if (indexedAvailability) {
      // Compute availability only if guest data fits the desired room occupancy
      if (!(
        hotel.roomTypes
        && hotel.roomTypes[pricingData[i].id]
        && hotel.roomTypes[pricingData[i].id].occupancy
        && (
          (hotel.roomTypes[pricingData[i].id].occupancy.min
          && hotel.roomTypes[pricingData[i].id].occupancy.min > guestData.helpers.numberOfGuests)
          || (hotel.roomTypes[pricingData[i].id].occupancy.max
          && hotel.roomTypes[pricingData[i].id].occupancy.max < guestData.helpers.numberOfGuests)
        )
      )) {
        let currentDate = dayjs(guestData.helpers.arrivalDateDayjs);
        let currentAvailability;
        let dailyAvailability = [];

        for (let j = 0; j < guestData.helpers.lengthOfStay; j += 1) {
          currentAvailability = indexedAvailability[currentDate.format('YYYY-MM-DD')];
          if (currentAvailability) {
            const isRestrictedForArrival = j === 0
            && currentAvailability.restrictions
            && currentAvailability.restrictions.noArrival;
            if (!isRestrictedForArrival) {
              dailyAvailability.push(currentAvailability.quantity);
            }
          }
          currentDate = currentDate.add(1, 'day');
        }
        // Deal with noDeparture restriction, it's a
        // special one - it is applied to the date *after* the last night
        currentAvailability = indexedAvailability[currentDate.format('YYYY-MM-DD')];
        if (
          currentAvailability
          && currentAvailability.restrictions
          && currentAvailability.restrictions.noDeparture
        ) {
          dailyAvailability = [];
        }

        // Filter out missing data and applied restrictions
        if (dailyAvailability.length === guestData.helpers.lengthOfStay) {
          result[i].quantity = dailyAvailability.reduce((agg, da) => {
            if (agg === undefined) {
              return da;
            }
            return Math.min(da, agg);
          }, undefined);
        }
      }
    }
  }
  return result;
};

export default {
  enhancePricingEstimates,
};
