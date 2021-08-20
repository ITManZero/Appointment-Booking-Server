module.exports.hashDate = function (date) {
  let hashKey = date.getFullYear();
  hashKey = hashKey * 31 + (date.getMonth() + 1);
  hashKey = hashKey * 31 + date.getDate();
  return hashKey;
};

module.exports.getExpireDate = function (date) {
  let d = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  return d;
};

//expected time format : hh:mm:ss
timeToDateFormat = function (time, date) {
  const splited = time.split(" ");
  if (!splited) splited = time;
  const t = splited[0].split(":");
  let newDate = new Date(date.getTime());
  newDate.setUTCHours(parseInt(t[0]));
  newDate.setUTCMinutes(parseInt(t[1]));
  newDate.setUTCSeconds(parseInt(t[2]));
  return newDate;
  // if(splited.length>1) changeTimeZone
};

module.exports.parseValidDate = function (
  start,
  end,
  constraints,
  period,
  date
) {
  let inValidRange = [];

  for (let i = 0; i < constraints.length; i++) {
    inValidRange.push({
      from: timeToDateFormat(constraints[i].from, date),
      to: timeToDateFormat(constraints[i].to, date),
    });
  }

  let temp = timeToDateFormat(start, date);
  let e = timeToDateFormat(end, date);

  let timeSlots = [];
  while (temp < e) {
    let valid = true;
    for (let i = 0; i < inValidRange.length; i++) {
      if (temp >= inValidRange[i].from && temp <= inValidRange[i].to) {
        valid = false;
        break;
      }
    }
    if (valid) timeSlots.push(temp);
    else valid = true;
    temp = new Date(temp.getTime() + period * 60 * 1000);
  }
  return timeSlots;
};
