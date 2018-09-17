import moment from 'moment';
import currency from 'currency.js';

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

const selectGuestSpecificModifier = (modifiers, age) => {
  const ageModifiers = modifiers.filter(mod => mod.conditions.maxAge !== undefined);
  const selectedAgeModifier = ageModifiers.reduce((best, current) => {
    if (current.conditions.maxAge >= age && ( // guest is under the bar
      !best // no best has yet been setup
      // current has a closer limit than the best
      || best.conditions.maxAge > current.conditions.maxAge
      || ( // the limit is the same, but current has better price adjustment
        best.conditions.maxAge === current.conditions.maxAge
        && best.adjustment > current.adjustment
      )
    )) {
      return current;
    }
    return best;
  }, undefined);
  if (selectedAgeModifier) {
    return selectedAgeModifier;
  }

  const genericModifiers = modifiers
    .filter(mod => mod.conditions.maxAge === undefined)
    .sort((a, b) => (a.adjustment <= b.adjustment ? -1 : 1));
  return genericModifiers[0];
};

const computeDailyPrice = (dateMoment, guestData, ratePlan) => {
  const applicableModifiers = selectApplicableModifiers(
    ratePlan.modifiers, dateMoment, guestData,
  );
  if (!applicableModifiers.length) {
    return currency(ratePlan.price).multiply(guestData.helpers.numberOfGuests);
  }

  const guestPrices = [];
  let selectedModifier;
  let adjustment;
  for (let i = 0; i < guestData.guestAges.length; i += 1) {
    adjustment = 0;
    // Pick the best modifier for each guest and adjust the price
    selectedModifier = selectGuestSpecificModifier(applicableModifiers, guestData.guestAges[i]);
    if (selectedModifier) {
      adjustment = (selectedModifier.adjustment / 100) * ratePlan.price;
    }
    guestPrices.push(ratePlan.price + adjustment);
  }
  return guestPrices.reduce((a, b) => a.add(currency(b)), currency(0));
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
          || currentDailyPrice.subtract(bestDailyPrice[currentCurrency]) <= 0) {
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
  for (let i = 0; i < allCurrencies.length; i += 1) {
    if (dailyPrices[allCurrencies[i]].length < guestData.helpers.lengthOfStay
      || dailyPrices[allCurrencies[i]].indexOf(undefined) > -1) {
      delete dailyPrices[allCurrencies[i]];
    }
  }
  return dailyPrices;
};

const getApplicableRatePlansFor = (roomType, guestData, ratePlans) => {
  const now = moment.utc();
  // filter out rateplans that are totally out of bounds
  return ratePlans.filter((rp) => {
    // apply general restrictions if any
    if (rp.restrictions) {
      if (rp.restrictions.bookingCutOff) {
        if (rp.restrictions.bookingCutOff.min
          && moment.utc(guestData.helpers.arrivalDateMoment)
            .subtract(rp.restrictions.bookingCutOff.min, 'days')
            .isBefore(now)
        ) {
          return false;
        }

        if (rp.restrictions.bookingCutOff.max
          && moment.utc(guestData.helpers.arrivalDateMoment)
            .subtract(rp.restrictions.bookingCutOff.max, 'days')
            .isAfter(now)
        ) {
          return false;
        }
      }
      if (rp.restrictions.lengthOfStay) {
        if (rp.restrictions.lengthOfStay.min
          && rp.restrictions.lengthOfStay.min > guestData.helpers.lengthOfStay
        ) {
          return false;
        }

        if (rp.restrictions.lengthOfStay.max
          && rp.restrictions.lengthOfStay.max < guestData.helpers.lengthOfStay
        ) {
          return false;
        }
      }
    }
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
      resultingPrice = dailyPrices[eligibleCurrencies[0]]
        .reduce((a, b) => a.add(currency(b)), currency(0));
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
