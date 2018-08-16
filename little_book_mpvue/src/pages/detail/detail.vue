<template>
  <div>
    <div v-if="bookData">
      <view class='cover-container'>
        <image v-bind:src='bookData.image'></image>
      </view>
      <view class='book-meta'>
        <view class='meta-info'>
          <text class='book-title'>{{bookData.title}}</text>
          <text class='book-subtitle' v-if="bookData.subtitle">{{bookData.subtitle}}</text>
          <text class='other-meta' v-if="bookData.author">作者: {{bookData.author}}</text>
          <text class='other-meta' v-if="bookData.translator && bookData.translator.length > 0">译者:
            {{bookData.translator}}
          </text>
          <text class='other-meta' v-if="bookData.category">分类: {{bookData.category}}</text>
          <text class='other-meta' v-if="bookData.publisher">出版社: {{bookData.publisher}}</text>
          <text class='other-meta' v-if="bookData.pubdate">出版日期: {{bookData.pubdate}}</text>
          <text class='other-meta' v-if="bookData.isbn">ISBN: {{bookData.isbn}}</text>
          <text class='other-meta' v-if="bookData.pages">总页数: {{bookData.pages}}</text>
          <text class='other-meta' v-if="bookData.price">定价: {{bookData.price}}</text>
          <text class='other-meta' v-if="bookData.binding">包装: {{bookData.binding}}</text>
        </view>
      </view>
      <view class='book-info'>
        <view class='intro-header'>
          <text>简介</text>
        </view>
        <text class='intro-content'>{{bookData.summary}}</text>
      </view>
    </div>
    <loading v-if="showLoading">
      加载中...
    </loading>
  </div>
</template>

<script>
  import requests from "../../requests/request.js";

  export default {
    data() {
      return {
        id: null,
        bookData: null,
        showLoading: true
      };
    },
    onLoad() {
      this.id = this.$root.$mp.query.id;
    },
    onReady() {
      let _id = this.id;
      let _this = this;
      requests.requestBookDetail(
        _id,
        (data) => {
          _this.bookData = data;
        },
        () => {
          wx.navigateBack();
        },
        () => {
          _this.showLoading = false;
        }
      );
    }
  };
</script>

<style scoped>
  .cover-container {
    background: #42BD56;
    display: flex;
    justify-content: center;
    padding: 48rpx 0; /*上下是40rpx, 左右是0*/
  }

  .cover-container image {
    width: 300rpx;
    height: 400rpx;
    vertical-align: bottom; /*img元素底部有空白的原因及解决https://www.zhihu.com/question/21558138*/
  }

  .book-meta {
    position: relative;
    padding: 20rpx;
    overflow: hidden;
  }

  .book-title {
    display: block;
    font-weight: bold;
    font-size: 50rpx;
  }

  .book-subtitle {
    display: block;
    font-weight: bold;
    font-size: 36rpx;
  }

  .other-meta {
    display: block;
    padding-top: 10rpx;
    color: #888;
    font-size: 30rpx
  }

  .book-info {
    padding: 20rpx;
    font-size: 40rpx;
  }

  .book-info .intro-header {
    color: #888
  }

  .book-info .intro-content {
    font-size: 35rpx;
    line-height: 45rpx;
  }
</style>
