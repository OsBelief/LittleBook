<template>
  <div>
    <div class='search_container'>
      <input type='text' v-model='searchKey' placeholder='输入书名搜索'/>
      <icon type='search' @click='searchClickEvent' size='20'></icon>
    </div>
    <scroll-view scroll-y='true' @scrolltolower='scrollLowerEvent' class='scroll_view'>
      <view class='not-find' v-if='!loadingMore && !isInit && totalRecord == 0'>
        <view>
          <icon class='icon' type='cancel' color='#B0AAAA' size='32'></icon>
          <view class='text'>
            <text>没有找到相关图书</text>
          </view>
        </view>
      </view>
      <view class='header' v-if="totalRecord > 0 && !isInit">
        <text>图书{{totalRecord}}本图书</text>
      </view>
      <view class='common-list' v-if='totalRecord > 0'>
        <view v-for='item in pageData' :key="item.id">
          <view class='list-item' :id='item.isbn' @click="toDetailPage">
            <view class='index-list-item'>
              <view class='cover'>
                <image class='cover-img' v-bind:src='item.image'></image>
              </view>
              <view class='content'>
                <view class='title'>{{item.title}}</view>
                <text class='desc'>{{item.pubdate}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="weui-loadmore" v-if='loadingMore'>
        <view class="weui-loading"></view>
        <view class="weui-loadmore-tips">正在加载</view>
      </view>
    </scroll-view>
  </div>
</template>

<!--Vue单文件组件,由<template>、<script>和<style>组成, template有且只有一个根元素>
<!-- ES6的模块加载(编译时加载), import和export, export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能 -->
<script>
  import card from "@/components/card";
  import requests from "../../requests/request.js";

  export default {
    data() {
      return {
        pageIndex: 0, // 页码
        pageData: [], // 图书数据
        totalRecord: 0, // 图书总数
        searchKey: null, // 搜索关键词
        isInit: true, // 是否第一次进入应用
        loadingMore: false // 是否正在加载更多
      };
    },

    components: {
      card
    },

    methods: {
      searchClickEvent() {
        if (!this.searchKey)
          return;
        this.pageIndex = 0;
        this.pageData = [];
        this.totalRecord = 0;
        this.isInit = false;

        this.requestData();
      },
      scrollLowerEvent() {
        console.log("scrollLowerEvent---");
        if (this.loadingMore)
          return;
        this.requestData();
      },
      requestData() {
        let _this = this;
        this.loadingMore = true;
        let q = _this.searchKey;
        let start = _this.pageIndex;
        requests.requestSearchBook({
            q: q,
            start: start
          },
          (data) => {
            console.log("requestSearchBook success ", data);
            if (data.total == 0) {
              _this.totalRecord = 0;
            } else {
              _this.pageData = _this.pageData.concat(data.books);
              _this.pageIndex = start + 1;
              _this.totalRecord = data.total;
            }
          },
          () => {
            console.log("requestSearchBook fail ");
            _this.totalRecord = 0;
          },
          () => {
            console.log("requestSearchBook complete ");
            _this.loadingMore = false;
          }
        );
      },
      toDetailPage: function(e) {
        let bid = e.currentTarget.id;
        wx.navigateTo({
          url: "../detail/main?id=" + bid
        });
      }
    }
  };
</script>

<style scoped>
  .search_container {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row; /*flex item的排列方向*/
    flex-wrap: nowrap; /*如果一条轴线排不下，如何换行*/
    justify-content: flex-start; /*主轴从左到右下的左对齐*/
    align-items: center; /*交叉轴从上到下的居中对齐*/
    background-color: #42bd56;
    height: 100rpx;
    padding: 0 10rpx 0 10rpx; /*上右下左*/
  }

  .search_container input {
    flex: 1;
    background: #fff;
    color: #aaa;
    height: 40rpx;
    padding: 6rpx 10rpx;
    border-radius: 5rpx;
  }

  .search_container icon {
    margin-left: 18rpx;
  }

  .header {
    padding: 20rpx 30rpx;
  }

  .header text {
    color: #a6a6a6;
  }

  .scroll_view {
    position: absolute;
    left: 0;
    top: 100rpx;
    right: 0;
    bottom: 0;
  }

  .scroll_view .not-find {
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .not-find .icon {
    display: flex;
    justify-content: center;
  }

  .not-find .text {
    padding: 20rpx;
  }

  .list-item {
    position: relative;
    overflow: hidden;
  }

  .index-list-item {
    background: #fff;
    padding: 15rpx 30rpx;
    overflow: hidden;
  }

  .index-list-item::active {
    background: #eee;
  }

  .index-list-item .cover {
    float: left;
    width: 120rpx;
    height: 160rpx;
    overflow: hidden;
  }

  .index-list-item .cover image.cover-img {
    width: 120rpx;
    height: 160rpx;
  }

  .index-list-item .content {
    margin-left: 140rpx;
  }

  .index-list-item .title {
    display: inline-block;
    height: 60rpx;
    padding-top: 20rpx;
    overflow: hidden;
  }

  .index-list-item .desc {
    display: block;
    font-size: 30rpx;
    padding-top: 10rpx;
    color: #aaa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*  加载更多   */
  .weui-loading {
    margin: 0 5px;
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    -webkit-animation: weuiLoading 1s steps(12, end) infinite;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
  }

  .weui-loadmore {
    width: 65%;
    margin: 1.5em auto;
    line-height: 1.6em;
    font-size: 14px;
    text-align: center;
  }

  .weui-loadmore-tips {
    display: inline-block;
    vertical-align: middle;
  }
</style>
