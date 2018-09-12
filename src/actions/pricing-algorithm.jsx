import moment from 'moment';

/*
from  string($date)
example: 2018-01-30
First day the modifier is applied to (including)

to  string($date)
example: 2018-02-20
Last day the modifier is applied to (including)

minLengthOfStay integer
Minimal length of stay the modifer is applicable to. If there are multiple modifiers with lengthOfStay condition matching the minimal length of stay, the price for the longest length of stay is used.

maxAge  integer
The modifier is applicable to occupants of this age or younger at the time of arrival to the stay. If multiple modifiers are specified with different maxAge, the modifier with the highest fitting limit is applied.

minOccupants  integer
The modifier is applicable if there are at least this number of persons staying in a room. If multiple modifiers are specified with different minOccupants, the modifier with the highest fitting limit is applied.
*/

const computeDailyPrice = (date, lengthOfStay, guestData, ratePlan) => {
  if (!ratePlan.modifiers) {
    return ratePlan.price * guestData.numberOfGuests;
  }
  // Drop modifiers not fitting the overall guest data
  const applicableModifiers = ratePlan.modifier.filter((rp) => {
    if (!rp.conditions) {
      return false;
    }
    if (rp.conditions.from) {
    }
    if (rp.conditions.to) {
    }
    if (rp.conditions.minLengthOfStay) {
    }
    if (rp.conditions.minOccupants) {
    }
    return true;
  });

  // TODO Apply modifiers separately for each guest
  // TODO verify modifers based on each guest, such as maxAge

  // Apply all modifiers and pick the lowest price

  return ratePlan.price * guestData.numberOfGuests;
};


const computeDailyPrices = (hotelCurrency, arrivalDateMoment, departureDateMoment,
  guestData, applicableRatePlans) => {
  const lengthOfStay = departureDateMoment.diff(arrivalDateMoment, 'days');
  const currentDate = moment(arrivalDateMoment);
  const dailyPrices = {};
  dailyPrices[hotelCurrency] = [];
  // Find an appropriate rate plan for every day
  for (let i = 0; i < lengthOfStay; i += 1) {
    let currentRatePlan;
    let currentCurrency;
    const bestDailyPrice = {};

    // loop over all rate plans and find the most fitting one for that day in all currencies
    for (let j = 0; j < applicableRatePlans.length; j += 1) {
      currentRatePlan = applicableRatePlans[j];
      currentCurrency = currentRatePlan.currency || hotelCurrency;
      if (!dailyPrices[currentCurrency]) {
        dailyPrices[currentCurrency] = [];
      }
      const availableForTravelFrom = moment.utc(currentRatePlan.availableForTravel.from);
      const availableForTravelTo = moment.utc(currentRatePlan.availableForTravel.to);
      // Deal with a rate plan ending sometimes during the stay
      if (currentDate >= availableForTravelFrom && currentDate <= availableForTravelTo) {
        const currentDailyPrice = computeDailyPrice(
          currentDate, lengthOfStay, guestData, currentRatePlan,
        );
        if (!bestDailyPrice[currentCurrency]
          || currentDailyPrice <= bestDailyPrice[currentCurrency]) {
          bestDailyPrice[currentCurrency] = currentDailyPrice;
        }
      }
    }
    const currencies = Object.keys(bestDailyPrice);
    for (let j = 0; j < currencies.length; j += 1) {
      dailyPrices[currencies[j]].push(bestDailyPrice[currencies[j]]);
    }
    currentDate.add(1, 'day');
  }

  // Filter out currencies that do not cover the whole stay range
  const allCurrencies = Object.keys(dailyPrices);
  let currency;
  for (let i = 0; i < allCurrencies.length; i += 1) {
    currency = allCurrencies[i];
    if (dailyPrices[currency].length < lengthOfStay
      || dailyPrices[currency].indexOf(undefined) > -1) {
      delete dailyPrices[currency];
    }
  }
  return dailyPrices;
};

const getApplicableRatePlansFor = (roomType, arrivalDateMoment, departureDateMoment, ratePlans) => {
  const now = moment.utc();
  // filter out rateplans that are totally out of bounds
  return ratePlans.filter((rp) => {
    const availableForTravelFrom = moment.utc(rp.availableForTravel.from);
    const availableForTravelTo = moment.utc(rp.availableForTravel.to);
    const availableForReservationFrom = moment.utc(rp.availableForReservation.from);
    const availableForReservationTo = moment.utc(rp.availableForReservation.to);
    // Rate plan is not tied to this room type
    if (rp.roomTypeIds.indexOf(roomType.id) === -1) {
      return false;
    }
    // Rate plan cannot be used today
    if (availableForReservationTo.isBefore(now)
        || availableForReservationFrom.isAfter(now)) {
      return false;
    }
    // Rate plan is totally out of bounds of travel dates
    if (availableForTravelTo.isBefore(arrivalDateMoment)
        || availableForTravelFrom.isAfter(departureDateMoment)) {
      return false;
    }
    return true;
  });
};

const computePrices = (hotel, guestData) => {
  let { roomTypes, ratePlans } = hotel;
  roomTypes = Object.values(roomTypes);
  ratePlans = Object.values(ratePlans);
  const arrivalDateMoment = moment.utc(guestData.arrival);
  const departureDateMoment = moment.utc(guestData.departure);

  return roomTypes.map((roomType) => {
    const applicableRatePlans = getApplicableRatePlansFor(
      roomType, arrivalDateMoment, departureDateMoment, ratePlans,
    );

    // no rate plans available at all, bail
    if (!applicableRatePlans.length) {
      return {
        id: roomType.id,
        price: undefined,
        currency: hotel.currency,
      };
    }

    const dailyPrices = computeDailyPrices(
      hotel.currency, arrivalDateMoment, departureDateMoment, guestData, applicableRatePlans,
    );
    // TODO keep estimates in multiple currencies
    // for now, randomly pick a currency
    const eligibleCurrencies = Object.keys(dailyPrices);
    let resultingPrice;
    if (eligibleCurrencies.length > 0) {
      resultingPrice = dailyPrices[eligibleCurrencies[0]].reduce((a, b) => a + b, 0);
    }

    return {
      id: roomType.id,
      price: resultingPrice,
      currency: eligibleCurrencies[0] || hotel.currency,
    };
  });
};


export default {
  getApplicableRatePlansFor,
  computeDailyPrices,
  computePrices,
  computeDailyPrice,
};
