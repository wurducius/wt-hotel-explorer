import dayjs from 'dayjs';

export const enhancePricingEstimates = (guestData, pricingData, hotel) => {
  if (!hotel.availability || !hotel.availability.availability) {
    return pricingData;
  }
  const result = [].concat(pricingData);

  for (let i = 0; i < pricingData.length; i += 1) {
    const roomAvailability = hotel.availability.availability[pricingData[i].id];
    if (roomAvailability) {
      // TODO move this so it's done only once for hotel data
      // let's index it by date for faster access
      const indexedAvailability = roomAvailability.reduce((agg, curr) => {
        const currDate = dayjs(curr.date);
        if (currDate >= guestData.helpers.arrivalDateDayjs
          && currDate <= guestData.helpers.departureDateDayjs) {
          return Object.assign({}, agg, {
            [curr.date]: curr,
          });
        }
        return agg;
      }, {});

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
  return result;
};

export default {
  enhancePricingEstimates,
};
