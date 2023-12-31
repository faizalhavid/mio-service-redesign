import { FULL_MONTH } from '../screens/Home/ChooseDateTime';

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeHelper = (number: number) => ({
  rangeMin: `${number > 12 ? number - 12 : number}`,
  rangeMax: `${number + 4 > 12 ? number + 4 - 12 : number + 4}`,
  minMeridian: `${number >= 12 ? 'PM' : 'AM'}`,
  maxMaxidian: `${number + 4 >= 12 ? 'PM' : 'AM'}`,
});

export const getReadableDateTime = (dt: string) => {
  if (!dt) {
    return {
      year: `-`,
      date: `-`,
      month: `-`,
      day: '-',
      slot: `-`,
      all: `-`,
      viewFullDate: '',
    };
  }
  const _startDate = new Date(dt);
  const _slot = timeHelper(_startDate.getHours());
  const result = {
    year: `${_startDate.getFullYear()}`,
    date: `${_startDate.getDate()}`,
    month: `${FULL_MONTH[_startDate.getMonth()]}`,
    day: DAY[_startDate.getDay()],
    slot: `${`${_slot.rangeMin} ${_slot.minMeridian}`} - ${`${_slot.rangeMax} ${_slot.maxMaxidian}`} `,
  };
  return {
    ...result,
    all: `${result.month} ${result.date}, ${result.slot}`,
    viewFullDate: `${result.date}-${result.month.substring(0, 3)}-${
      result.year
    } ${_startDate.getHours()}:${_startDate.getMinutes()}:${_startDate.getSeconds()}`,
  };
};

export function isNonNull(value: any) {
  return value !== null;
}
