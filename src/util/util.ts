import * as QueryString from 'query-string';

function padStart(padNum: number, padValue: string, value: string): string {
  if (value.length < padNum) {
    const pad = String(padValue).repeat(padNum - value.length);
    return pad + value;
  }
  return value;
}

function getNestedAttr(obj: any, nestedAttr: string[]) {
  return nestedAttr.reduce(
    (nested, next) => (nested && nested[next] ? nested[next] : null),
    obj
  );
}

function getOptionsFromEnum(options: any) {
  return Object.keys(options).map((o) => ({
    label: options[o],
    value: options[o],
  }));
}

function input2date(date: number) {
  const dateStr = String(date);
  const dateFields = [
    dateStr.substr(0, 2),
    dateStr.substr(2, 2),
    dateStr.substr(4, 4),
  ];
  const formattedDate = new Date(
    Number(dateFields[2]),
    Number(dateFields[0]) - 1,
    Number(dateFields[1])
  );
  return formattedDate.toString();
}

function date2input(date: string) {
  const parsed = new Date(date);
  const day = padStart(2, '0', String(parsed.getDate()));
  const month = padStart(2, '0', String(parsed.getMonth() + 1));
  const year = parsed.getUTCFullYear();
  return `${month}${day}${year}`;
}

function getValueFromQuery(key: string): string | undefined {
  const queries: any = QueryString.parse(location.search);
  return queries[key];
}

function normalizeArray<T>(array: T[], indexKey: keyof T) {
  const normalizedObject: any = {};
  for (const el of array) {
    const key = el[indexKey];
    normalizedObject[key] = el;
  }
  return normalizedObject as { [key: string]: T };
}

export {
  padStart,
  getNestedAttr,
  getOptionsFromEnum,
  getValueFromQuery,
  input2date,
  date2input,
  normalizeArray,
};
