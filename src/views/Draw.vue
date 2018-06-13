<template>
<div class="app-container">
  <div class="canvas-container">
    <canvas 
    id="canvas"
    :width="canvasWidth" 
    :height="canvasHeight"
    @mousedown="drawStart"
    @mousemove="drawTo"
    @mouseup="drawEnd"
    @touchstart="drawStart" 
    @touchmove="drawTo"
    @touchend="drawEnd"
    >
    </canvas>
  </div>

    <flexbox>
      <flexbox-item>
        <x-button plain mini @click.native="save">save</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button plain mini @click.native="showClearConfirm=true">clear</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button plain mini @click.native="redo">redo</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button plain mini @click.native="undo">undo</x-button>
      </flexbox-item>
    </flexbox>
    
    <flexbox class="ctl-row">
      <flexbox-item v-for="item in lineWidths" :key="item" class="width-example-box" :class="{active:item==lineWidth}" @click.native="selectLineWidth(item)">
        <span :class="'width-example-'+item"></span>
        <span>{{item}}</span>
      </flexbox-item>
    </flexbox>

    <color-picker class="ctl-row" v-for="colorArr in predefineColors" :key="colorArr.key" :colors="colorArr" v-model="brushColor" size="middle"></color-picker>

    <x-dialog v-model="showImgDlg" class="dialog-demo" hide-on-blur>
      <div class="img-box">
        <img :src="imgData" style="max-width:100%">
      </div>
      <div>
        <span style="color:#777">长按或右键保存</span>
      </div>
    </x-dialog>

    <confirm 
      v-model="showClearConfirm"
      @on-confirm="clear"
      hide-on-blur
      >
      <p style="text-align:center;">确定清除画布?</p>
    </confirm>

</div>
</template>

<script>
import Draw from "@/utils/Draw";
import WsClient from "@/utils/WsClient";

import { evtPointInCanvas } from "@/utils/Draw/util";

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
      lineWidths: [2, 4, 6, 10, 18],
      predefineColors: [
        ["#fff", "#000", "#9b9b9b", "#ff4c62"],
        ["#fec410", "#fdf902", "#91c601", "#516dfe"],
        ["#2ccff5", "#9c7cff", "#00A64C", "#af743f"],
        ["#cca86d", "#f0d881", "#ffc4d6", "#ff00b2"]
      ],

      canvas: null,
      context: null,
      draw: null,
      ws: null,

      lineWidth: 2,
      brushColor: "#000"
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
      this.selectBrushColor(val);
    }
  },
  mounted() {
    let canvas = document.querySelector("#canvas");
    if (!canvas.getContext) {
      alert("该浏览器不支持<canvas>");
      return;
    }
    this.canvas = canvas;

    this.draw = new Draw("#canvas");
    this.draw.clearCanvas();

    this.ws = new WsClient({
      host: require("../gameCfg.js").wsHost,
      port: 44300,
      playerRole: "painter"
    });
  },
  methods: {
    clear() {
      this.draw.clear();
      this.ws.send({ type: "clear" });
    },
    undo() {
      this.draw.undo();
      this.ws.send({ type: "undo" });
    },
    redo() {
      this.draw.redo();
      this.ws.send({ type: "redo" });
    },
    save() {
      // console.log("save");
      const canvas = document.getElementById("canvas");
      const img = canvas.toDataURL("image/png");
      this.imgData = img;
      this.showImgDlg = true;
    },

    drawStart(evt) {
      evt.preventDefault();
      let p = evtPointInCanvas(evt, this.canvas);
      this.draw.drawStart(p.x, p.y);
      this.ws.send({ type: "drawStart", point: { x: p.x, y: p.y } });
    },
    drawTo(evt) {
      evt.preventDefault();
      if (!this.draw.drawing) return;
      let p = evtPointInCanvas(evt, this.canvas);
      this.draw.drawTo(p.x, p.y);
      this.ws.send({ type: "drawTo", point: { x: p.x, y: p.y } });
    },
    drawEnd(evt) {
      evt.preventDefault();
      this.draw.drawEnd(evt);
      this.ws.send({ type: "drawEnd" });
    },

    selectLineWidth(width) {
      this.draw.selectLineWidth(width);
      this.lineWidth = width;
      this.ws.send({ type: "selectLineWidth", value: width });
    },
    selectBrushColor(color) {
      this.draw.selectBrushColor(color);
      this.ws.send({ type: "selectBrushColor", value: color });
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
