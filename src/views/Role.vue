<template>
  <div>
    <flexbox orient="vertical" directhon="column" justify="center" >
      <flexbox-item>
        <x-button  type="primary" @click.native="navTo('/draw')">我来画</x-button>
      </flexbox-item>

      <flexbox-item>
        <x-button  type="primary" @click.native="navTo('audience')">我来猜</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton } from "vux";

export default {
  components: {
    Flexbox,
    FlexboxItem,
    XButton
  },
  methods: {
    navTo(path) {
      this.$router.push({ path: path });
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
</style>
