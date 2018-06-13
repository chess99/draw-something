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
import WsClient from "@/utils/WsClient";

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
      draw: null,
      ws: null
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

    let ws = new WsClient({
      host: require("../gameCfg.js").wsHost,
      port: 44300,
      playerRole: "audience"
    });
    ws.bind("drawStart", msg => {
      this.draw.drawStart(msg.point.x, msg.point.y);
    });
    ws.bind("drawTo", msg => {
      this.draw.drawTo(msg.point.x, msg.point.y);
    });
    ws.bind("drawEnd", msg => {
      this.draw.drawEnd();
    });
    ws.bind("selectLineWidth", msg => {
      this.draw.selectLineWidth(msg.value);
    });
    ws.bind("selectBrushColor", msg => {
      this.draw.selectBrushColor(msg.value);
    });
    ws.bind("undo", msg => {
      this.draw.undo();
    });
    ws.bind("redo", msg => {
      this.draw.redo();
    });
    ws.bind("clear", msg => {
      this.draw.clear();
    });
    this.ws = ws;
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
