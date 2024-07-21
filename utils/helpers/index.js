const moment = require('moment');

module.exports = {
  getByLimitAndOffset: (limit, offset) => {
    const limitOffset =
        limit?.toString()?.length && offset?.toString()?.length && limit !== 'undefined' && offset !== 'undefined' ? `LIMIT ${limit} OFFSET ${offset * limit}` : "";

    return limitOffset
  },

  dateTimeConverter:(dateTime) => {
    if (dateTime) {
      return moment(dateTime).format('DD-MM-YYYY');
    }
    return '';
  }
}