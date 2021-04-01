import { DAYS } from './constants'

export const convertToNearestHour = (n, precision = 4) => {
  let msHour = 60 * 60 * 1000;
  return Math.round((n / msHour) * precision) / precision;
};

export const convertForExport = (data) => {
  let readyData = [];
  let ix = 0;
  Object.values(data).forEach((p) => {
    let row = { id: ix, Project: p.name, Billable: p.billable };
    Object.keys(p.elapsedTime).forEach((d) => {
      row[DAYS[d]] = convertToNearestHour(p.elapsedTime[d]);
    });
    readyData.push(row);
    ix += 1;
  });
  return readyData;
};
