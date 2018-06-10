<template>
    <canvas 
    id="canvas"
    :width="canvasWidth" 
    :height="canvasHeight"
    @touchstart="drawHeartEvt"
    @mousedown="drawHeartEvt"
    >
    </canvas>
</template>

<script>
import Draw from "@/utils/Draw";

export default {
  mounted() {
    let canvas = document.querySelector("#canvas");
    if (!canvas.getContext) {
      alert("该浏览器不支持<canvas>");
      return;
    }

    this.draw = new Draw("#canvas");
    this.draw.clearCanvas();

    window.bixin = window.比心 = this.drawHeartSlow;
  },
  computed: {
    canvasWidth() {
      return document.documentElement.clientWidth;
    },
    canvasHeight() {
      return document.documentElement.clientHeight;
    }
  },
  methods: {
    sleep(mSec) {
      return new Promise(resolve => setTimeout(resolve, mSec));
    },
    async drawHeart(xOffset, yOffset, interval_msec) {
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      interval_msec = interval_msec || 0;

      this.draw.selectBrushColor("#f00");
      let t, x, y;
      let started = false;
      for (t = 0; t < 2 * Math.PI; t += 0.1) {
        x = 16 * Math.pow(Math.sin(t), 3);
        y =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);
        x *= 3;
        x += xOffset;
        y = -3 * y;
        y += yOffset;

        if (interval_msec > 0) {
          await this.sleep(interval_msec);
        }

        if (!started) {
          this.draw.drawStart(x, y);
          started = true;
        }
        this.draw.drawTo(x, y);
      }
      this.draw.drawEnd();
    },
    drawHeartEvt(evt) {
      console.log(evt.pageX, evt.pageY);
      this.drawHeart(evt.pageX, evt.pageY);
    },
    drawHeartSlow(x, y) {
      this.drawHeart(x, y, 50);
    }
  }
};
</script>

<style>
</style>
