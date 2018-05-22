<template lang="html">
  <div class="img-wrapper">
    <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
      <!-- slides -->
      <swiper-slide v-for="item in list" :key="item.id" class="swiper-item">
        <img v-if="item.picture_url" :src="item.picture_url + '?x-oss-process=image/resize,h_1000'" alt="图片缺失" @click="hide">
        <!-- <img v-else src="item.picture_url" alt="图片缺失" @click="hide"> -->
        <img v-else  src="http://m6fresh.img-cn-shanghai.aliyuncs.com/img/store-withoutPic-20a249d1ee572aa5f066b32df229eb4f.png?x-oss-process=image/resize,h_1000" alt="图片缺失" @click="hide">
        <div class="detail">
          <h3>{{item.store_name}} [{{item.store_code}}]</h3>
          <p v-if="item.picture_url"><span class="item-name">[{{item.t_name}}]</span><span v-if="item.attr1">:{{item.attr1}}</span></p>
          <p v-else>{{item.t_name}}: 未上传</p>
          <p>
            <b v-show="Number(item.is_timely_update)===0" class="no">(未及时更新)</b>
            <b v-show="Number(item.is_timely_update)===1" class="no">(删除)</b>
            <b v-show="item.is_timely_update==='-1'" class="ok">(及时更新)</b>
            <b v-show="Number(item.is_timely_update)===2" class="new">(新增)</b>
            <span class="content">{{item.last_img_upload_time}}</span>
          </p>
        </div>
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
      <div class="swiper-scrollbar"   slot="scrollbar"></div>
    </swiper>
  </div>
</template>
<script>
// import rdSwipe from 'vue-slide'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    initIndex: {
      type: Number,
      default: 0
    },
    callback: {
      type: Function,
      default () {
      }
    },
    showShift: {
      type: Boolean,
      default: false
    },
    prevCallback: {
      type: Function,
      default () {
      }
    },
    nextCallback: {
      type: Function,
      default () {
      }
    }
  },
  data () {
    return {
      index: 0,
      swiperOption: {
        // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        // notNextTick: true,
        // swiper configs 所有的配置同swiper官方api配置
        autoplay: 0,
        direction : 'horizontal',
        grabCursor : true,
        setWrapperSize :true,
        autoHeight: true,
        pagination : '.swiper-pagination',
        paginationClickable: true,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
        scrollbar:'.swiper-scrollbar',
        mousewheelControl : true,
        observeParents: true,
        // if you need use plugins in the swiper, you can config in here like this
        // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
        // debugger: true,
        // swiper callbacks
        // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
        onTransitionStart(swiper){
        },
        // more Swiper configs and callbacks...
        // ...
      }
    }
  },
  watch: {
    initIndex () {
      this.swiper.slideTo(this.initIndex, 200, false)
    }
  },
  // you can find current swiper instance object like this, while the notNextTick property value must be true
  // 如果你需要得到当前的swiper对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的swiper对象，同时notNextTick必须为true
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted() {
    // you can use current swiper instance object to do something(swiper methods)
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
  },
  methods: {
    hide () {
      this.$emit('hide')
    },
    doCallback () {
      if (this.callback) {
        this.callback.call(window)
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style lang="less" scoped>
  .img-wrapper{
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000000;
    img {
      width: 80%;
      color: red;
      font-size: 128px;
    }
    .link-text{
      position: absolute;
      bottom: 15%;
      right: 10%;
      background-color: rgba(255, 255, 255, 0.6);
    }
    .upload-item{
      position: absolute;
      width: 20%;
      bottom: 0;
      left: 40%;
    }
    .swiper-box {
      width: 100%;
      height: 100%;
      margin: 0 auto;
    }
    .swiper-item {
      height: 100%;
      text-align: center;
      font-size: 18px ;
      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      position: relative;
      .detail{
        position: absolute;
        width: 80%;
        /* height: 50px; */
        /* left: 8%; */
        bottom: 0;
        padding: 5px;
        bottom: 15%;
        /* left: 0px; */
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        text-align: left;
        .item-name{
          // color:
        }
        h3 {
          font-size: 16px;
          font-weight: bold;
          padding: 1px;
          // padding-left: 5px;
          /* height: 20px; */
        }
        p {
          font-size: 14px;
          padding: 1px;
          b{
            &.no{
              color: red;
            }
            &.delete{
              color: red;
            }
            &.ok{
              color: green;
            }
            &.new{
              color: #cddc39;
            }
          }
          .content{
            text-align: right;
          }
        }
      }
    }
  }
</style>
