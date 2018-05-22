<template>
  <div class="">
    <div id="allmap" v-bind:style="mapStyle" hidden></div>
    <p hidden>
      {{position}}
    </p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        mapStyle: {
          width: '100%',
          height: this.mapHeight +'px'
        },
        position: ''
      }
    },
    methods: {
      init (BMap) {
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition((r) => {
          if(geolocation.getStatus() == BMAP_STATUS_SUCCESS){
            this.$emit('get-position',r);
            this.position = JSON.stringify(r)
            console.dir(r);
          } else {
            console.error('failed'+this.getStatus());
          }        
        }, {enableHighAccuracy: true})
      }
    },
    mounted: function () {
      let timer = setInterval(() => {
        if (window.BMap) {
          this.init(window.BMap)
          clearInterval(timer)
          timer = null
          window.console.info('百度地图初始化完成')
        }
        window.console.info('百度地图初始化中...')
      }, 500)
    }
  }
</script>