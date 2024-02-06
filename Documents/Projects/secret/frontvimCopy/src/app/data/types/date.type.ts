
type DateRangeType = {
  startDate: null | string;
  endDate: null | string;
}

type DateType = string | DateRangeType | null;

export {
  DateRangeType,
  DateType,
};
