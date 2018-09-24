import dayjs from 'dayjs';

export const selectApplicableModifiers = (guestData, modifiers, dateDayjs) => {
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
    if (mod.conditions.from && dayjs(mod.conditions.from).diff(dateDayjs, 'days') > 0) {
      return false;
    }
    if (mod.conditions.to && dayjs(mod.conditions.to).diff(dateDayjs, 'days') < 0) {
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

export const selectGuestSpecificModifier = (modifiers, age) => {
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

export const getApplicableRatePlansFor = (guestData, roomType, ratePlans) => {
  const now = dayjs();
  // filter out rateplans that are totally out of bounds
  return ratePlans.filter((rp) => {
    // apply general restrictions if any
    if (rp.restrictions) {
      if (rp.restrictions.bookingCutOff) {
        if (rp.restrictions.bookingCutOff.min
          && dayjs(guestData.helpers.arrivalDateDayjs)
            .subtract(rp.restrictions.bookingCutOff.min, 'days')
            .isBefore(now)
        ) {
          return false;
        }

        if (rp.restrictions.bookingCutOff.max
          && dayjs(guestData.helpers.arrivalDateDayjs)
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
    const availableForTravelFrom = dayjs(rp.availableForTravel.from);
    const availableForTravelTo = dayjs(rp.availableForTravel.to);
    const availableForReservationFrom = dayjs(rp.availableForReservation.from);
    const availableForReservationTo = dayjs(rp.availableForReservation.to);
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
    if (availableForTravelTo.isBefore(guestData.helpers.arrivalDateDayjs)
        || availableForTravelFrom.isAfter(guestData.helpers.departureDateDayjs)) {
      return false;
    }
    return true;
  });
};

export default {
  selectApplicableModifiers,
  selectGuestSpecificModifier,
  getApplicableRatePlansFor,
};
