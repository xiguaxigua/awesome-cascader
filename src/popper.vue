<template>
  <div
    class="cascader-popper"
    @mouseenter="mouseIn = true"
    @mouseleave="mouseIn = false"
    v-show="innerPopup"
    :style="popperStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Popper',

  props: {
    position: {
      type: Object,
      default () {
        return { left: 0, top: 0, height: 0 }
      }
    },
    popup: Boolean
  },

  data () {
    return {
      mouseIn: false
    }
  },

  computed: {
    popperStyle () {
      const { left, top, height } = this.position
      return {
        left: left + 'px',
        top: top + height + 'px'
      }
    },

    innerPopup: {
      get () { return this.popup },
      set (v) { this.$emit('update:popup', v) }
    }
  },

  methods: {
    bodyClickHandler () {
      if (!this.mouseIn) this.innerPopup = false
    }
  },

  mounted () {
    this.$nextTick(() => {
      document.body.appendChild(this.$el)
    })
    document.addEventListener('click', this.bodyClickHandler)
  },

  beforeDestroy () {
    document.removeEventListener('click', this.bodyClickHandler)
  }
}
</script>

<style lang="less">
.cascader-popper {
  position: absolute;
}
</style>
