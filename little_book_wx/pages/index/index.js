//index.js
var requests = require('../../requests/requset.js')

Page({
    data: {
        pageIndex: 0, // 页码
        pageData: [], // 图书数据
        totalRecord: 0, // 图书总数
        searchKey: null, // 搜索关键词
        isInit: true, // 是否第一次进入应用
        loadingMore: false, // 是否正在加载更多
    },
    //事件处理函数
    searchInputEvent: function(event) {
        this.setData({
            searchKey: event.detail.value
        });
    },
    searchClickEvent: function(event) {
        if (!this.data.searchKey)
            return;
        this.setData({
            pageIndex: 0,
            pageData: [],
            totalRecord: 0
        });
        requestData.call(this);
    },
    scrollLowerEvent: function() {
        console.log('scrollLowerEvent---');
        if (this.data.loadingMore)
            return;
        requestData.call(this);
    },
    toDetailPage: function(e) {
        console.log('toDetailPage---');
        var bid = e.currentTarget.dataset.bid;
        wx.navigateTo({
            url: '../detail/detail?id=' + bid,
        })
    }
})

function requestData() {
    var _this = this;
    var q = _this.data.searchKey;
    var start = _this.data.pageIndex;
    this.setData({
        loadingMore: true,
        isInit: false
    });
    requests.requestSearchBook({
            q: q,
            start: start
        },
        (data) => {
            console.log("requestSearchBook success ", data);
            if (data.total == 0) {
                _this.setData({
                    totalRecord: 0
                });
            } else {
                _this.setData({
                    pageData: _this.data.pageData.concat(data.books),
                    pageIndex: start + 1,
                    totalRecord: data.total
                })
            }
        },
        () => {
            console.log("requestSearchBook fail ");
            _this.setData({
                totalRecord: 0
            });
        },
        () => {
            console.log("requestSearchBook complete ");
            _this.setData({
                loadingMore: false
            });
        }
    );
}