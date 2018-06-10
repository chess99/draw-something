<template>
<div class="app-container">
  <div class="canvas-container">
    <canvas 
    id="canvas"
    :width="canvasWidth" 
    :height="canvasHeight"
    >
    </canvas>
  </div>

    <flexbox >
      <flexbox-item >
        <x-button plain mini @click.native="save">save</x-button>
      </flexbox-item>
    </flexbox>
    
    <x-dialog v-model="showImgDlg" class="dialog-demo" hide-on-blur>
      <div class="img-box">
        <img :src="imgData" style="max-width:100%">
      </div>
      <div>
        <span style="color:#777">长按或右键保存</span>
      </div>
    </x-dialog>

</div>
</template>

<script>
import Draw from "@/utils/Draw";

import {
  ColorPicker,
  Flexbox,
  FlexboxItem,
  XButton,
  XDialog,
  Confirm
} from "vux";

export default {
  data() {
    return {
      viewportContentBackup: "",
      showImgDlg: false,
      showClearConfirm: false,
      imgData: null,

      canvasWidth: 350,
      canvasHeight: 400,

      context: null,
      draw: null
    };
  },
  computed: {},
  components: {
    ColorPicker,
    Flexbox,
    FlexboxItem,
    XButton,
    XDialog,
    Confirm
  },
  created() {
    let viewport = document.querySelector("meta[name=viewport]");
    this.viewportContentBackup = viewport.getAttribute("content");
    viewport.setAttribute(
      "content",
      "width=device-width,initial-scale=1.0,user-scalable=0"
    );
  },
  beforeDestroy() {
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", this.viewportContentBackup);
  },
  watch: {
    brushColor(val, oldVal) {
      this.draw.selectBrushColor(val);
    }
  },
  mounted() {
    let canvas = document.querySelector("#canvas");
    if (!canvas.getContext) {
      alert("该浏览器不支持<canvas>");
      return;
    }

    this.draw = new Draw("#canvas");
    this.draw.clearCanvas();
  },
  methods: {
    save() {
      // console.log("save");
      const canvas = document.getElementById("canvas");
      const img = canvas.toDataURL("image/png");
      this.imgData = img;
      this.showImgDlg = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 360px;
  margin: 0px auto;
}
.canvas-container {
  width: 352px;
  margin: 0px auto;
}
#canvas {
  border: solid 1px black;
  margin: 0 auto;
}
.ctl-row {
  margin: 6px auto;
}
.width-example-box {
  display: inline-block;
  background-color: #eee;
  border-radius: 5px;
  width: 3rem;
  padding-left: 0.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  vertical-align: center;
  margin: 0px 3px;
  cursor: pointer;

  &.active {
    background-color: rgb(81, 216, 81);
  }
}

$lineWidthList: 2 4 6 10 18;
@each $i in $lineWidthList {
  .width-example-#{$i} {
    display: inline-block;
    background-color: black;
    width: #{$i}px;
    height: #{$i}px;
    border-radius: #{$i/2}px;
    margin: 0 auto;
  }
}
</style>
