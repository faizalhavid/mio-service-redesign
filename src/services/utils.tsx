import { MONTH } from "../screens/Home/EditServiceDetails";
const DAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeHelper = (number: number) => {
  return {
    rangeMin: `${number > 12 ? number - 12 : number}`,
    rangeMax: `${number + 4 > 12 ? number + 4 - 12 : number + 4}`,
    minMeridian: `${number >= 12 ? "PM" : "AM"}`,
    maxMaxidian: `${number + 4 >= 12 ? "PM" : "AM"}`,
  };
};

export const getReadableDateTime = (dt: string) => {
  let _startDate = new Date(dt);
  let _slot = timeHelper(_startDate.getHours());
  let result = {
    year: `${_startDate.getFullYear()}`,
    date: `${MONTH[_startDate.getMonth()]} ${_startDate.getDate()}`,
    day: DAY[_startDate.getDay()],
    slot: `${_slot.rangeMin + " " + _slot.minMeridian} - ${
      _slot.rangeMax + " " + _slot.maxMaxidian
    } `,
  };
  return { ...result, all: `${result.day}, ${result.date}, ${result.slot}` };
};
