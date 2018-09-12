import moment from 'moment';

export const computeDailyPrice = (basePrice, numberOfGuests) => basePrice * numberOfGuests;

export const getApplicableRatePlansFor = (roomType, arrivalDate, departureDate, ratePlans) => {
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
    if (availableForTravelTo.isBefore(arrivalDate)
        || availableForTravelFrom.isAfter(departureDate)) {
      return false;
    }
    return true;
  });
};

export const computeDailyPrices = (hotelCurrency, arrivalDate, departureDate,
  numberOfGuests, applicableRatePlans) => {
  const lengthOfStay = departureDate.diff(arrivalDate, 'days');
  const currentDate = moment(arrivalDate);
  const dailyPrices = {};
  dailyPrices[hotelCurrency] = [];
  // Find an appropriate rate plan for every day
  for (let i = 0; i < lengthOfStay; i += 1) {
    let currentRatePlan;
    let currentCurrency = hotelCurrency;
    const bestDailyPrice = {};
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
        const currentPrice = computeDailyPrice(currentRatePlan.price, numberOfGuests);
        if (!bestDailyPrice[currentCurrency] || currentPrice <= bestDailyPrice[currentCurrency]) {
          bestDailyPrice[currentCurrency] = currentPrice;
        }
      }
    }
    if (bestDailyPrice[currentCurrency] === undefined) {
      bestDailyPrice[currentCurrency] = -1;
    }
    dailyPrices[currentCurrency].push(bestDailyPrice[currentCurrency]);
    currentDate.add(1, 'day');
  }

  // Filter out currencies that do not cover the whole stay range
  const allCurrencies = Object.keys(dailyPrices);
  let currency;
  for (let i = 0; i < allCurrencies.length; i += 1) {
    currency = allCurrencies[i];
    if (dailyPrices[currency].length < lengthOfStay || dailyPrices[currency].indexOf(-1) > -1) {
      delete dailyPrices[currency];
    }
  }
  return dailyPrices;
};

export const computePrices = (hotel, guestData) => {
  let { roomTypes, ratePlans } = hotel;
  roomTypes = Object.values(roomTypes);
  ratePlans = Object.values(ratePlans);
  const arrivalDate = moment.utc(guestData.arrival);
  const departureDate = moment.utc(guestData.departure);

  return roomTypes.map((roomType) => {
    const applicableRatePlans = getApplicableRatePlansFor(
      roomType, arrivalDate, departureDate, ratePlans,
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
      hotel.currency, arrivalDate, departureDate, guestData.numberOfGuests, applicableRatePlans,
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
