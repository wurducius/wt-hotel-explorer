import moment from 'moment';

const selectApplicableModifiers = (modifiers, dateMoment, guestData) => {
  if (!modifiers || !modifiers.length) {
    return [];
  }
  // Drop modifiers not fitting the overall guest data
  let maxMinLOS;
  let maxMinOccupants;
  const elementsToDrop = [];
  const applicableModifiers = modifiers.filter((mod) => {
    if (!mod.conditions) {
      return false;
    }
    if (mod.conditions.from && moment.utc(mod.conditions.from).diff(dateMoment, 'days') > 0) {
      return false;
    }
    if (mod.conditions.to && moment.utc(mod.conditions.to).diff(dateMoment, 'days') < 0) {
      return false;
    }
    if (mod.conditions.minLengthOfStay) {
      if (mod.conditions.minLengthOfStay > guestData.helpers.lengthOfStay) {
        return false;
      }
      if (maxMinLOS
        && mod.conditions.minLengthOfStay < maxMinLOS.conditions.minLengthOfStay
      ) {
        return false;
      }
      if (maxMinLOS) {
        elementsToDrop.push(maxMinLOS);
      }
      maxMinLOS = mod;
      return true;
    }
    if (mod.conditions.minOccupants) {
      if (mod.conditions.minOccupants > guestData.helpers.numberOfGuests) {
        return false;
      }
      if (maxMinOccupants
        && mod.conditions.minOccupants < maxMinOccupants.conditions.minOccupants
      ) {
        return false;
      }
      if (maxMinOccupants) {
        elementsToDrop.push(maxMinOccupants);
      }
      maxMinOccupants = mod;
      return true;
    }
    return true;
  });
  return applicableModifiers.filter(mod => elementsToDrop.indexOf(mod) === -1);
};

const computeDailyPrice = (dateMoment, guestData, ratePlan) => {
  const applicableModifiers = selectApplicableModifiers(
    ratePlan.modifiers, dateMoment, guestData,
  );
  if (!applicableModifiers.length) {
    return ratePlan.price * guestData.helpers.numberOfGuests;
  }
  applicableModifiers.sort((a, b) => (a.adjustment <= b.adjustment ? -1 : 1));

  const guestPrices = [];
  let selectedModifier;
  let adjustment;
  for (let i = 0; i < guestData.helpers.numberOfGuests; i += 1) {
    // Pick the best modifier and adjust the price
    // TODO work with information specific for each guest
    selectedModifier = applicableModifiers[0].adjustment / 100;
    adjustment = selectedModifier * ratePlan.price;
    guestPrices.push(ratePlan.price + adjustment);
  }
  // THIS IS SO WRONG! TODO fix #23
  return parseFloat((guestPrices.reduce((a, b) => a + b, 0)).toFixed(2), 10);
};


const computeDailyPrices = (hotelCurrency, guestData, applicableRatePlans) => {
  const currentDate = moment.utc(guestData.helpers.arrivalDateMoment);
  const dailyPrices = {};
  dailyPrices[hotelCurrency] = [];
  // Find an appropriate rate plan for every day
  for (let i = 0; i < guestData.helpers.lengthOfStay; i += 1) {
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
          currentDate, guestData, currentRatePlan,
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
    if (dailyPrices[currency].length < guestData.helpers.lengthOfStay
      || dailyPrices[currency].indexOf(undefined) > -1) {
      delete dailyPrices[currency];
    }
  }
  return dailyPrices;
};

const getApplicableRatePlansFor = (roomType, guestData, ratePlans) => {
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
    if (availableForTravelTo.isBefore(guestData.helpers.arrivalDateMoment)
        || availableForTravelFrom.isAfter(guestData.helpers.departureDateMoment)) {
      return false;
    }
    return true;
  });
};

const computePrices = (hotel, guestData) => {
  let { roomTypes, ratePlans } = hotel;
  roomTypes = Object.values(roomTypes);
  ratePlans = Object.values(ratePlans);

  return roomTypes.map((roomType) => {
    const applicableRatePlans = getApplicableRatePlansFor(
      roomType, guestData, ratePlans,
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
      hotel.currency, guestData, applicableRatePlans,
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
