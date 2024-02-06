import { DateType, DateRangeType } from "@data/types";
import * as moment from "moment";

type DateRangeAsDateType = {
  startDate: Date | null;
  endDate: Date | null;
};

export function getYear(date: DateType): number {
  if (date == null || date === "") {
    return moment().utc().year();
  } else {
    return typeof date === "object"
      ? moment(getDateFromRange(date)).utc().year()
      : moment(date).utc().year();
  }
}

export function getCleanDateRange(date: DateType): DateRangeType {
  const year = getYear(date);
  const startDate = moment("01-01-" + year, "MM-DD-YYYY")
    .utcOffset(0)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .toISOString();
  const endDate = moment("12-31-" + year, "MM-DD-YYYY")
    .utcOffset(0)
    .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    .toISOString();

  return {
    startDate,
    endDate,
  };
}

export function isInRange(
  incomingVigenciaDate: // rango para comparar
  DateType,
  incomingDate: // fecha para revisar si esta en rango
  DateType
): boolean {
  const vigenciaDate = dateRangeAsDate(incomingVigenciaDate);
  const date = dateRangeAsDate(incomingDate);

  if (vigenciaDate.startDate && vigenciaDate.endDate) {
    return (
      ((!date.startDate || date.startDate <= vigenciaDate.endDate) &&
        (!date.endDate || date.endDate >= vigenciaDate.startDate)) ||
      ((!date.startDate || date.startDate >= vigenciaDate.startDate) &&
        (!date.startDate || date.startDate <= vigenciaDate.endDate)) ||
      (date.startDate &&
        date.startDate >= vigenciaDate.startDate &&
        date.endDate &&
        date.endDate <= vigenciaDate.endDate) ||
      ((!date.startDate || date.startDate <= vigenciaDate.endDate) &&
        !date.endDate)
    );
  } else if (!vigenciaDate.startDate && vigenciaDate.endDate) {
    return !date.startDate || date.startDate <= vigenciaDate.endDate;
  } else if (vigenciaDate.startDate && !vigenciaDate.endDate) {
    return !date.endDate || date.endDate >= vigenciaDate.startDate;
  }
  return false;
}

function getDateFromRange(date: DateRangeType): string {
  return date.startDate !== null
    ? date.startDate
    : date.endDate ?? moment().utc().toISOString();
}

function dateRangeAsDate(incomingDate: DateType): DateRangeAsDateType {
  // Remove undefined / null
  incomingDate = incomingDate ?? moment().utc().toISOString();

  // Hacerlos un rango siempre
  incomingDate =
    typeof incomingDate === "string"
      ? { startDate: incomingDate, endDate: incomingDate }
      : incomingDate;

  // Cambiar a tipo fecha
  const date = {
    startDate: incomingDate.startDate
      ? moment(incomingDate.startDate).utc().toDate()
      : null,
    endDate: incomingDate.endDate
      ? moment(incomingDate.endDate).utc().toDate()
      : null,
  };

  return date;
}
