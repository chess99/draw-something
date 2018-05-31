<template>
<div>
    <canvas 
    id="canvas"
    :width="canvasWidth" 
    :height="canvasHeight"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart" 
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    >
    </canvas>

    <div class="ctl-row">
      <button @click="clear">clear</button>
    </div>

    <div class="ctl-row">
      <div v-for="item in lineWidths" :key="item" class="width-example-box" :class="{active:item==lineWidth}" @click.capture.prevent="selectLineWidth(item)">
        <span :class="'width-example-'+item"></span>
        <span>{{item}}</span>
      </div>
    </div>

    <div class="ctl-row">
      <el-color-picker v-model="brushColor" popper-class="color-picker-popper-class" :predefine="predefineColors"></el-color-picker>
    </div>

</div>
</template>

<script>
import DrawLine from "@/utils/DrawLine";
import { getOffset } from "@/utils/util";
import { ColorPicker } from "element-ui";

export default {
  data() {
    return {
      viewportContentBackup: "",
      context: null,
      draw: null,
      canvasWidth: 340,
      canvasHeight: 400,
      _ptOffset: 0.5,
      _canX: null,
      _canY: null,
      lineWidths: [2, 4, 6, 10, 18],
      lineWidth: 2,
      predefineColors: [
        "#000000",
        "#ffffff",
        "#9b9b9b",
        "#ff4c62",
        "#fec410",
        "#fdf902",
        "#91c601",
        "#516dfe",
        "#2ccff5",
        "#9c7cff",
        "#00A64C",
        "#af743f",
        "#cca86d",
        "#f0d881",
        "#ffc4d6",
        "#ff00b2"
      ],
      brushColor: "#000"
    };
  },
  components: {
    [ColorPicker.name]: ColorPicker
  },
  created() {
    let viewport = document.querySelector("meta[name=viewport]");
    this.viewportContentBackup = viewport.getAttribute("content");
    viewport.setAttribute("content", "width=360, user-scalable=no");
  },
  beforeDestroy() {
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", this.viewportContentBackup);
  },
  watch: {
    brushColor(val, oldVal) {
      if (typeof val !== "string") return;
      this.draw.setBrushColor(val);
    }
  },
  mounted() {
    let canvas = document.querySelector("#canvas");
    if (canvas.getContext) {
      this.context = canvas.getContext("2d");
    } else {
      alert("该浏览器不支持<canvas>");
      return;
    }

    this._canX = getOffset(canvas).left;
    this._canY = getOffset(canvas).top;
    console.log("offset", this._canX, this._canY);
    this.draw = new DrawLine("#canvas");
  },
  methods: {
    clear() {
      return this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    onMouseDown(evt) {
      evt.preventDefault();
      return this.draw.start(evt.offsetX, evt.offsetY);
    },
    onTouchStart(evt) {
      evt.preventDefault();
      let touch = event.touches[0];
      const x = touch.pageX - this._canX;
      const y = touch.pageY - this._canY;
      return this.draw.start(x, y);
    },
    onMouseMove(evt) {
      evt.preventDefault();
      return this.draw.drawTo(evt.offsetX, evt.offsetY);
    },
    onTouchMove(evt) {
      evt.preventDefault();
      let touch = event.touches[0];
      const x = touch.pageX - this._canX;
      const y = touch.pageY - this._canY;
      return this.draw.drawTo(x, y);
    },
    onMouseUp() {
      return this.draw.end();
    },
    onTouchEnd() {
      return this.draw.end();
    },
    selectLineWidth(width) {
      console.log("selectLineWidth", width);
      this.lineWidth = width;
      return this.draw.setLineWidth(width);
    }
  }
};
</script>

<style lang="scss" scoped>
#canvas {
  border: solid 1px black;
  margin: 0 auto;
}
.ctl-row {
  margin: 10px auto;
}
.width-example-box {
  display: inline-block;
  background-color: #eee;
  border-radius: 5px;
  width: 3rem;
  height: 3rem;
  line-height: 3rem;
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
  }
}

.color-picker-popper-class {
  width: 100%;
}
</style>
