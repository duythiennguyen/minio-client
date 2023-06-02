import { validate } from './validation';

const convert = {
  dateJson: (value: string, type: string | undefined) => {
    if (validate.isNullOrEmpty(value)) {
      return '';
    }
    if (type === undefined) {
      let monthR: string, dayR: string;
      let newdate = new Date(parseInt(value));
      let month = newdate.getMonth() + 1;
      let day = newdate.getDate();
      let year = newdate.getFullYear();
      monthR = month < 10 ? '0' + month : month + '';
      dayR = day < 10 ? '0' + day : day + '';
      return dayR + '/' + monthR + '/' + year;
    } else if (type === 'dd/MM') {
      let monthR: string, dayR: string;
      let newdate = new Date(parseInt(value));
      let month = newdate.getMonth() + 1;
      let day = newdate.getDate();
      monthR = month < 10 ? '0' + month : month + '';
      dayR = day < 10 ? '0' + day : day + '';
      return dayR + '/' + monthR;
    }
  },
  dateTimeJson: (value: any) => {
    if (validate.isNullOrEmpty(value)) {
      return '';
    }
    let monthR: string, dayR: string, hhR: string, mmR: string, ssR: string;
    let newdate = new Date(parseInt(value.substr(6)));
    let month = newdate.getMonth() + 1;
    let day = newdate.getDate();
    let year = newdate.getFullYear();
    let hh = newdate.getHours();
    let mm = newdate.getMinutes();
    let ss = newdate.getSeconds();
    monthR = month < 10 ? '0' + month : month + '';
    dayR = day < 10 ? '0' + day : day + '';
    hhR = hh < 10 ? '0' + hh : hh + '';
    mmR = mm < 10 ? '0' + mm : mm + '';
    ssR = ss < 10 ? '0' + ss : ss + '';
    return dayR + '/' + monthR + '/' + year + ' ' + hhR + ':' + mmR + ':' + ssR;
  },
  dateTimeFormat: (value: any) => {
    if (validate.isNullOrEmpty(value)) {
      return '';
    }
    let monthR: string, dayR: string, hhR: string, mmR: string, ssR: string;
    let newdate = new Date(value);
    let month = newdate.getMonth() + 1;
    let day = newdate.getDate();
    let year = newdate.getFullYear();
    let hh = newdate.getHours();
    let mm = newdate.getMinutes();
    let ss = newdate.getSeconds();
    monthR = month < 10 ? '0' + month : month + '';
    dayR = day < 10 ? '0' + day : day + '';
    hhR = hh < 10 ? '0' + hh : hh + '';
    mmR = mm < 10 ? '0' + mm : mm + '';
    ssR = ss < 10 ? '0' + ss : ss + '';
    return dayR + '/' + monthR + '/' + year + ' ' + hhR + ':' + mmR + ':' + ssR;
  },
  dateFormat: (value: any) => {
    if (validate.isNullOrEmpty(value)) {
      return '';
    }
    let monthR: string, dayR: string, hhR: string, mmR: string, ssR: string;
    let newdate = new Date(value);
    let month = newdate.getMonth() + 1;
    let day = newdate.getDate();
    let year = newdate.getFullYear();

    monthR = month < 10 ? '0' + month : month + '';
    dayR = day < 10 ? '0' + day : day + '';
    return dayR + '/' + monthR + '/' + year ;
  },
  dateToString: (value: Date, type: string | null) => {
    if (type !== null) {
      if (type === 'yyyy/MM/dd') {
        let monthR: string, dayR: string;

        let month = value.getMonth() + 1;
        let day = value.getDate();
        let year = value.getFullYear();

        monthR = month < 10 ? '0' + month : month + '';
        dayR = day < 10 ? '0' + day : day + '';

        return year + '/' + monthR + '/' + dayR;
      }
      if (type === 'dd/MM') {
        let monthR: string, dayR: string;

        let month = value.getMonth();
        let day = value.getDate();
        monthR = month < 10 ? '0' + month : month + '';
        dayR = day < 10 ? '0' + day : day + '';

        return +dayR + '/' + monthR;
      }
    } else {
      let monthR: string, dayR: string;

      let month = value.getMonth();
      let day = value.getDate();
      let year = value.getFullYear();

      monthR = month < 10 ? '0' + month : month + '';
      dayR = day < 10 ? '0' + day : day + '';

      return dayR + '/' + monthR + '/' + year;
    }
  },
  changeKeyName: (data: any, keyName: string, newKeyName: string) => {
    for (let i = 0; i < data.length; i++) {
      data[i][newKeyName] = data[i][keyName];
      delete data[i][keyName];
    }
  },
  numberToString: (num: any) => {
    if (num === null || num === undefined || num.toString().trim() === '') {
      return '';
    } else if (!isFinite(num)) {
      return num.toString();
    } else if (num < 999) {
      return num.toString();
    } else {
      if (num === 0) {
        return '0';
      } else {
        return num
          .toString()
          .trim()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&,');
      }
    }
  },
};
const round = (value: number, roundNum: number) => {
  const toFix = 1;
  const roundText = +toFix.toFixed(roundNum).replace(',', '').replace('.', '');
  let numberRetunr: number = Math.round(value * roundText) / roundText;
  if (isNaN(numberRetunr)) {
    return 0;
  } else {
    return numberRetunr;
  }
};
const roundToString = (value: number, roundNum: number) => {
  return convert.numberToString(round(value, roundNum));
};
export { convert, round, roundToString };
