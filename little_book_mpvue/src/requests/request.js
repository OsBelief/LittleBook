let api = require("./api.js");
let utils = require("../utils/util.js");

function request(url, data, successCb, errorCb, completeCb) {
  wx.request({
    url: url,
    data: data,
    method: "GET",
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      console.log("request success ", res);
      utils.isFunction(successCb) && successCb(res.data);
    },
    fail: function(res) {
      console.log("request fail ", res);
      utils.isFunction(errorCb) && errorCb();
    },
    complete: function(res) {
      console.log("request complete ", res);
      utils.isFunction(completeCb) && completeCb();
    }
  });
}

function requestSearchBook(data, successCb, errorCb, completeCb) {
  request(api.API_BOOK_SEARCH, data, successCb, errorCb, completeCb);
}

function requestBookDetail(isbn, successCb, errorCb, completeCb) {
  request(api.API_BOOK_DETAIL + "/" + isbn, "", successCb, errorCb, completeCb);
}

module.exports = {
  requestSearchBook: requestSearchBook,
  requestBookDetail: requestBookDetail
};
