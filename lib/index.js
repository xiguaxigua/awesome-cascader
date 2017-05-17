'use strict';

var Popper = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { directives: [{ name: "show", rawName: "v-show", value: _vm.innerPopup, expression: "innerPopup" }], staticClass: "cascader-popper", style: _vm.popperStyle, on: { "mouseenter": function mouseenter($event) {
          _vm.mouseIn = true;
        }, "mouseleave": function mouseleave($event) {
          _vm.mouseIn = false;
        } } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'Popper',

  props: {
    position: {
      type: Object,
      default: function _default() {
        return { left: 0, top: 0, height: 0 };
      }
    },
    popup: Boolean
  },

  data: function data() {
    return {
      mouseIn: false
    };
  },


  computed: {
    popperStyle: function popperStyle() {
      var _position = this.position,
          left = _position.left,
          top = _position.top,
          height = _position.height;

      return {
        left: left + 'px',
        top: top + height + 'px'
      };
    },


    innerPopup: {
      get: function get() {
        return this.popup;
      },
      set: function set(v) {
        this.$emit('update:popup', v);
      }
    }
  },

  methods: {
    bodyClickHandler: function bodyClickHandler() {
      if (!this.mouseIn) this.innerPopup = false;
    }
  },

  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      document.body.appendChild(_this.$el);
    });
    document.addEventListener('click', this.bodyClickHandler);
  },
  beforeDestroy: function beforeDestroy() {
    document.removeEventListener('click', this.bodyClickHandler);
  }
};

var List = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "awesome-cascader-list", on: { "click": _vm.clickHandler, "mousemove": _vm.moveHandler } }, _vm._l(_vm.levels, function (level, index) {
      return _c('ul', { key: level, staticClass: "item-container", style: _vm.getInnerItemStyle(index) }, _vm._l(level, function (item, innerIndex) {
        return _c('li', { key: item, staticClass: "item-section", class: _vm.getItemClass(item), attrs: { "data-type": "item", "data-id": item.i, "data-level": index, "data-index": innerIndex, "data-checked": !!item.checked } }, [_vm._v(_vm._s(item.n))]);
      }));
    }));
  }, staticRenderFns: [],
  name: 'List',

  props: {
    options: { type: Object, default: function _default() {
        return {};
      }
    },
    itemStyle: Object
  },

  data: function data() {
    return {
      levels: [],
      currentTarget: []
    };
  },


  computed: {
    innerItemStyle: function innerItemStyle() {
      return { width: this.itemStyle && this.itemStyle.width };
    }
  },

  methods: {
    moveHandler: function moveHandler(e) {
      var dataset = e.target.dataset;

      if (dataset && dataset.type === 'item') {
        var targetLevel = dataset.level;
        var targetId = dataset.id;
        var nextLevel = +targetLevel + 1;
        if (this.currentTarget[targetLevel] !== targetId && this.options[nextLevel]) {
          this.currentTarget[targetLevel] = targetId;
          this.levels.splice(nextLevel);
          this.$set(this.levels, nextLevel, this.options[nextLevel][targetId]);
        }
      }
    },
    clickHandler: function clickHandler(e) {
      var dataset = e.target.dataset;

      if (dataset && dataset.type === 'item') {
        var targetLevel = +dataset.level;
        var targetId = dataset.id;
        var targetIndex = dataset.index;
        var checked = !dataset.checked || dataset.checked === 'false';
        var nextLevel = +targetLevel + 1;
        var parentId = targetLevel === 0 ? 0 : this.currentTarget[targetLevel - 1];
        var sibList = this.options[targetLevel][parentId];
        var preLevel = +targetLevel - 1;
        // 子集全选/全不选
        if (this.options[nextLevel] && this.options[nextLevel][targetId]) {
          this.checkedAllChildren(this.options[nextLevel][targetId], targetLevel + 1, checked);
        }
        // 父级状态判断
        if (targetLevel) {
          var grandParentId = targetLevel === 1 ? 0 : this.currentTarget[targetLevel - 2];
          var status = checked || sibList.some(function (item) {
            return item.i !== targetId && item.checked;
          });
          var targetItem = void 0;
          this.options[preLevel][grandParentId].some(function (item) {
            if (item.i === parentId) {
              targetItem = item;
              return true;
            }
          });
          this.checkedAllParents({
            target: targetItem,
            sibList: sibList,
            level: targetLevel,
            status: status,
            targetId: targetId,
            parentId: parentId,
            grandParentId: grandParentId
          });
        }
        // 处理自身
        sibList[targetIndex].checked = checked;
        this.getSelectedItem();
      }
    },
    getSelectedItem: function getSelectedItem() {
      var selected = [];
      var lastOptions = this.options[this.options.struct.length - 1];
      Object.keys(lastOptions).forEach(function (key) {
        lastOptions[key].forEach(function (item) {
          if (item.checked) {
            selected.push(item.chain);
          }
        });
      });
      this.$emit('change', selected);
    },
    checkedAllChildren: function checkedAllChildren(targetList, level, status) {
      var _this = this;

      targetList.forEach(function (item) {
        item.checked = status;
        var nextLevel = level + 1;
        var next = _this.options[nextLevel];
        if (next) _this.checkedAllChildren(next[item.i], nextLevel, status);
      });
    },
    checkedAllParents: function checkedAllParents(_ref) {
      var target = _ref.target,
          sibList = _ref.sibList,
          level = _ref.level,
          status = _ref.status,
          targetId = _ref.targetId,
          parentId = _ref.parentId,
          grandParentId = _ref.grandParentId;

      target.checked = status || sibList.some(function (item) {
        return item.i !== targetId && item.checked;
      });
      var preLevel = level - 1;
      var preTarget = void 0;
      var preSibList = void 0;
      var preTargetId = target.i;
      var preParentId = void 0;
      var preGrandParentId = void 0;
      if (preLevel > 0) {
        preGrandParentId = preLevel === 1 ? 0 : this.currentTarget[preLevel - 2];
        var grandSibList = this.options[preLevel - 1][preGrandParentId];
        preSibList = this.options[preLevel][grandParentId];
        preParentId = preLevel === 0 ? 0 : this.currentTarget[preLevel - 1];
        grandSibList.some(function (item) {
          if (item.i === preParentId) {
            preTarget = item;
            return true;
          }
        });
      }
      if (preTarget) {
        this.checkedAllParents({
          target: preTarget,
          sibList: preSibList,
          level: preLevel,
          status: status,
          targetId: preTargetId,
          parentId: preParentId,
          grandParentId: preGrandParentId
        });
      }
    },
    getInnerItemStyle: function getInnerItemStyle(index) {
      return {
        width: this.itemStyle && this.itemStyle.width,
        left: (parseInt(this.itemStyle.width) + 1) * index + 'px'
      };
    },
    getItemClass: function getItemClass(item) {
      return {
        checked: item.checked,
        ind: item.ind
      };
    }
  },

  watch: {
    options: {
      immediate: true,
      handler: function handler(options) {
        var levels = [];
        if (options) levels[0] = options[0][0];
        this.levels = levels;
      }
    }
  }
};

var DEFAULT_BTN_STYLE = {
  width: '80px',
  height: '30px'
};
var DEFAULT_ITEM_STYLE = {
  width: '100px'
};

var index = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "awesome-cascader" }, [_c('div', { ref: "acBtn", staticClass: "ac-title", class: _vm.btnClass, style: _vm.innerBtnStyle, on: { "click": function click($event) {
          $event.stopPropagation();_vm.btnClickHandler($event);
        } } }, [_vm._v(_vm._s(_vm.tip))]), _c('popper', { attrs: { "position": _vm.position, "popup": _vm.visible }, on: { "update:popup": function updatePopup($event) {
          _vm.visible = $event;
        } } }, [_c('list', { attrs: { "options": _vm.options, "item-style": _vm.itemStyle }, on: { "change": _vm.changeHandler } })], 1)], 1);
  }, staticRenderFns: [],
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
      default: function _default() {
        return [];
      }
    },
    tip: {
      type: String,
      default: '请选择请选择请选择请选择请选择请选择请选择请选择请选择'
    },
    btnStyle: {
      type: Object,
      default: function _default() {
        return DEFAULT_BTN_STYLE;
      }
    },
    itemStyle: {
      type: Object,
      default: function _default() {
        return DEFAULT_ITEM_STYLE;
      }
    }
  },

  data: function data() {
    return {
      visible: false,
      position: {},
      mouseIn: false
    };
  },


  computed: {
    btnClass: function btnClass() {
      return { 'bottom-triangle': !this.visible, 'top-triangle': this.visible };
    },
    innerBtnStyle: function innerBtnStyle() {
      return Object.assign({ lineHeight: this.btnStyle.height }, this.btnStyle);
    }
  },

  created: function created() {
    var _this = this;

    var keyMap = {};
    var selectedItem = [];
    this.selected.forEach(function (item) {
      item.split(' ').forEach(function (child) {
        selectedItem.push(child);
      });
    });
    this.innerOptions = this.options.struct.forEach(function (_, index) {
      Object.keys(_this.options[index]).forEach(function (key) {
        _this.options[index][key].forEach(function (item) {
          keyMap[item.i] = key;
          item.checked = !!~selectedItem.indexOf(item.i);
          var chain = item.i;
          var target = item.i;
          while (keyMap[target] && keyMap[target] !== '0') {
            chain += ' ' + keyMap[target];
            target = keyMap[target];
          }
          item.chain = chain.split(' ').reverse().join(' ');
        });
      });
    });
  },


  methods: {
    changePosition: function changePosition() {
      var _$refs$acBtn$getBound = this.$refs.acBtn.getBoundingClientRect(),
          left = _$refs$acBtn$getBound.left,
          top = _$refs$acBtn$getBound.top,
          height = _$refs$acBtn$getBound.height;

      this.position = { left: left, top: top, height: height };
    },
    btnClickHandler: function btnClickHandler() {
      this.changePosition();
      this.visible = !this.visible;
    },
    changeHandler: function changeHandler(selected) {
      this.$emit('change', selected);
    }
  },

  mounted: function mounted() {
    this.$nextTick(this.changePosition);
  },


  components: { Popper: Popper, List: List }
};

module.exports = index;
