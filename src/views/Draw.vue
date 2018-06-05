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

    <confirm v-model="showClearConfirm"
      @on-confirm="clear"
      >
      <p style="text-align:center;">确定清除画布?</p>
    </confirm>

</div>
</template>

<script>
import { getOffset, getEvtPagePoint, saveAsPNG } from "@/utils/util";

import DrawLine from "@/utils/DrawLine";
import DrawHistory from "@/utils/DrawHistory";

import {
  ColorPicker,
  Group,
  Cell,
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
      _ptOffset: 0.5,
      _canX: null,
      _canY: null,
      lineWidths: [2, 4, 6, 10, 18],
      predefineColors: [
        ["#fff", "#000", "#9b9b9b", "#ff4c62"],
        ["#fec410", "#fdf902", "#91c601", "#516dfe"],
        ["#2ccff5", "#9c7cff", "#00A64C", "#af743f"],
        ["#cca86d", "#f0d881", "#ffc4d6", "#ff00b2"]
      ],

      context: null,
      draw: null,
      drawHistory: null,

      drawing: false,
      lineWidth: 2,
      brushColor: "#000"
    };
  },
  computed: {},
  components: {
    ColorPicker,
    Group,
    Cell,
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
      if (typeof val !== "string") return;
      this.draw.setBrushColor(val);
      this.drawHistory.setBrushColor(val);
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
    this.drawHistory = new DrawHistory();
    this.clearCanvas();
  },
  methods: {
    clear() {
      console.log("clear");
      this.clearCanvas();
      this.clearHistory();
    },
    clearCanvas() {
      this.context.fillStyle = "white";
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    clearHistory() {
      this.drawHistory.clear();
    },
    undo() {
      console.log("undo");
      this.drawHistory.undo();
      this.clearCanvas();
      this.drawHistory.history.forEach(stroke => {
        this.draw.drawStoke(stroke);
      });
    },
    redo() {
      console.log("redo");
      this.drawHistory.redo();
      this.clearCanvas();
      this.drawHistory.history.forEach(stroke => {
        this.draw.drawStoke(stroke);
      });
    },
    save() {
      console.log("save");
      const canvas = document.getElementById("canvas");
      const img = canvas.toDataURL("image/png");
      // saveAsPNG("download.png", img);
      this.imgData = img;
      this.showImgDlg = true;
    },

    isPointInCanvasArea(x, y) {
      return (
        x >= 0 && x <= this.canvasWidth && y >= 0 && y <= this.canvasHeight
      );
    },
    drawStart(evt) {
      evt.preventDefault();
      let p = getEvtPagePoint(evt);
      let x = p.x - this._canX;
      let y = p.y - this._canY;

      if (!this.isPointInCanvasArea(x, y)) {
        return;
      }
      this.drawing = true;
      this.draw.start(x, y);
      this.drawHistory.start(x, y);
    },
    drawTo(evt) {
      evt.preventDefault();
      if (!this.drawing) return;
      let p = getEvtPagePoint(evt);
      let x = p.x - this._canX;
      let y = p.y - this._canY;

      if (!this.isPointInCanvasArea(x, y)) {
        this.drawEnd();
        return;
      }
      this.draw.drawTo(x, y);
      this.drawHistory.drawTo(x, y);
    },
    drawEnd() {
      this.drawing = false;
      this.draw.end();
      this.drawHistory.end();
    },

    selectLineWidth(width) {
      console.log("selectLineWidth", width);
      this.lineWidth = width;
      this.draw.setLineWidth(width);
      this.drawHistory.setLineWidth(width);
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
