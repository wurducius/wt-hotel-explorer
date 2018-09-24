import dayjs from 'dayjs';
import currency from 'currency.js';
import { selectApplicableModifiers, selectGuestSpecificModifier, getApplicableRatePlansFor } from './rate-plans';

const computeDailyPrice = (dateDayjs, guestData, ratePlan) => {
  const applicableModifiers = selectApplicableModifiers(
    ratePlan.modifiers, dateDayjs, guestData,
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
  const dailyPrices = {};
  let currentDate = dayjs(guestData.helpers.arrivalDateDayjs);
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
      const availableForTravelFrom = dayjs(currentRatePlan.availableForTravel.from);
      const availableForTravelTo = dayjs(currentRatePlan.availableForTravel.to);
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
    currentDate = currentDate.add(1, 'day');
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
  computeDailyPrices,
  computePrices,
  computeDailyPrice,
};
