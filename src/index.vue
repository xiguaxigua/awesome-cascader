<template>
  <div class="awesome-cascader">
    <div
      class="ac-title"
      :style="innerBtnStyle"
      @click.stop="btnClickHandler"
      ref="acBtn"
      :class="btnClass">
      {{ tip }}
    </div>
    <popper :position="position" :popup.sync="visible">
      <list @change="changeHandler" :options="options" :item-style="itemStyle"></list>
    </popper>
  </div>
</template>

<script>
import Popper from './popper'
import List from './list'

const DEFAULT_BTN_STYLE = {
  width: '80px',
  height: '30px'
}
const DEFAULT_ITEM_STYLE = {
  width: '100px'
}

export default {
  name: 'AwesomeCascader',

  props: {
    options: {
      type: Object,
      required: true
    },
    value: {
      type: [Array, String],
      required: true
    },
    selected: {
      type: Array,
      default () {
        return []
      }
    },
    tip: {
      type: String,
      default: '请选择请选择请选择请选择请选择请选择请选择请选择请选择'
    },
    btnStyle: {
      type: Object,
      default () {
        return DEFAULT_BTN_STYLE
      }
    },
    itemStyle: {
      type: Object,
      default () {
        return DEFAULT_ITEM_STYLE
      }
    }
  },

  data () {
    return {
      visible: false,
      position: {},
      mouseIn: false
    }
  },

  computed: {
    btnClass () {
      return { 'bottom-triangle': !this.visible, 'top-triangle': this.visible }
    },

    innerBtnStyle () {
      return Object.assign({ lineHeight: this.btnStyle.height }, this.btnStyle)
    }
  },

  created () {
    const keyMap = {}
    const selectedItem = []
    this.selected.forEach(item => {
      item.split(' ').forEach(child => {
        selectedItem.push(child)
      })
    })
    this.innerOptions = this.options.struct.forEach((_, index) => {
      Object.keys(this.options[index]).forEach(key => {
        this.options[index][key].forEach(item => {
          keyMap[item.i] = key
          item.checked = !!~selectedItem.indexOf(item.i)
          let chain = item.i
          let target = item.i
          while (keyMap[target] && keyMap[target] !== '0') {
            chain += ' ' + keyMap[target]
            target = keyMap[target]
          }
          item.chain = chain.split(' ').reverse().join(' ')
        })
      })
    })
  },

  methods: {
    changePosition () {
      const { left, top, height } = this.$refs.acBtn.getBoundingClientRect()
      this.position = { left, top, height }
    },

    btnClickHandler () {
      this.changePosition()
      this.visible = !this.visible
    },

    changeHandler (selected) {
      this.$emit('change', selected)
    }
  },

  mounted () {
    this.$nextTick(this.changePosition)
  },

  components: { Popper, List }
}
</script>

<style lang="less">
.awesome-cascader {
  .ac-title {
    border: 1px solid #e1e1e1;
    font-size: 14px;
    padding-left: 10px;
    vertical-align: middle;
    color: #888;
    border-radius: 4px;
    position: relative;
    user-select: none;
    padding-right: 30px;
    .one-line;
  }

  .top-triangle {
    .triangle;
  }

  .bottom-triangle {
    .triangle(-180deg);
  }

  /* utils */
  .triangle (@rotate: 0) {
    &::before {
      content: '';
      position: absolute;
      right: 10px;
      top: 50%;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-top: 0;
      border-bottom-color: #ccc;
      transition: transform .3s;
      transform: translateY(-50%) rotate(@rotate);
    }
  }

  .one-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
