<template>
  <div
    class="awesome-cascader-list"
    @click="clickHandler"
    @mousemove="moveHandler">
    <ul
      v-for="(level, index) in levels"
      :key="level"
      :style="getInnerItemStyle(index)"
      class="item-container">
      <li
        v-for="(item, innerIndex) in level"
        data-type="item"
        :class="getItemClass(item)"
        :data-id="item.i"
        :data-level="index"
        :data-index="innerIndex"
        :data-checked="!!item.checked"
        :key="item"
        class="item-section">
        {{ item.n }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'List',

  props: {
    options: { type: Object, default () { return {} } },
    itemStyle: Object
  },

  data () {
    return {
      levels: [],
      currentTarget: []
    }
  },

  computed: {
    innerItemStyle () {
      return { width: this.itemStyle && this.itemStyle.width }
    }
  },

  methods: {
    moveHandler (e) {
      const { target: { dataset } } = e
      if (dataset && dataset.type === 'item') {
        const targetLevel = dataset.level
        const targetId = dataset.id
        const nextLevel = +targetLevel + 1
        if (this.currentTarget[targetLevel] !== targetId &&
          this.options[nextLevel]) {
          this.currentTarget[targetLevel] = targetId
          this.levels.splice(nextLevel)
          this.$set(this.levels, nextLevel, this.options[nextLevel][targetId])
        }
      }
    },

    clickHandler (e) {
      const { target: { dataset } } = e
      if (dataset && dataset.type === 'item') {
        const targetLevel = +dataset.level
        const targetId = dataset.id
        const targetIndex = dataset.index
        const checked = !dataset.checked || dataset.checked === 'false'
        const nextLevel = +targetLevel + 1
        const parentId = targetLevel === 0 ? 0 : this.currentTarget[targetLevel - 1]
        const sibList = this.options[targetLevel][parentId]
        const preLevel = +targetLevel - 1
        // 子集全选/全不选
        if (this.options[nextLevel] && this.options[nextLevel][targetId]) {
          this.checkedAllChildren(this.options[nextLevel][targetId], targetLevel + 1, checked)
        }
        // 父级状态判断
        if (targetLevel) {
          const grandParentId = targetLevel === 1 ? 0 : this.currentTarget[targetLevel - 2]
          const status = checked || sibList.some(item => item.i !== targetId && item.checked)
          let targetItem
          this.options[preLevel][grandParentId].some(item => {
            if (item.i === parentId) {
              targetItem = item
              return true
            }
          })
          this.checkedAllParents({
            target: targetItem,
            sibList,
            level: targetLevel,
            status,
            targetId,
            parentId,
            grandParentId
          })
        }
        // 处理自身
        sibList[targetIndex].checked = checked
        this.getSelectedItem()
      }
    },

    getSelectedItem () {
      const selected = []
      const lastOptions = this.options[this.options.struct.length - 1]
      Object.keys(lastOptions).forEach(key => {
        lastOptions[key].forEach(item => {
          if (item.checked) {
            selected.push(item.chain)
          }
        })
      })
      this.$emit('change', selected)
    },

    checkedAllChildren (targetList, level, status) {
      targetList.forEach(item => {
        item.checked = status
        const nextLevel = level + 1
        const next = this.options[nextLevel]
        if (next) this.checkedAllChildren(next[item.i], nextLevel, status)
      })
    },

    checkedAllParents ({ target, sibList, level, status, targetId, parentId, grandParentId }) {
      target.checked = status || sibList.some(item => item.i !== targetId && item.checked)
      const preLevel = level - 1
      let preTarget
      let preSibList
      let preTargetId = target.i
      let preParentId
      let preGrandParentId
      if (preLevel > 0) {
        preGrandParentId = preLevel === 1 ? 0 : this.currentTarget[preLevel - 2]
        let grandSibList = this.options[preLevel - 1][preGrandParentId]
        preSibList = this.options[preLevel][grandParentId]
        preParentId = preLevel === 0 ? 0 : this.currentTarget[preLevel - 1]
        grandSibList.some(item => {
          if (item.i === preParentId) {
            preTarget = item
            return true
          }
        })
      }
      if (preTarget) {
        this.checkedAllParents({
          target: preTarget,
          sibList: preSibList,
          level: preLevel,
          status,
          targetId: preTargetId,
          parentId: preParentId,
          grandParentId: preGrandParentId
        })
      }
    },

    getInnerItemStyle (index) {
      return {
        width: this.itemStyle && this.itemStyle.width,
        left: (parseInt(this.itemStyle.width) + 1) * index + 'px'
      }
    },

    getItemClass (item) {
      return {
        checked: item.checked,
        ind: item.ind
      }
    }
  },

  watch: {
    options: {
      immediate: true,
      handler (options) {
        const levels = []
        if (options) levels[0] = options[0][0]
        this.levels = levels
      }
    }
  }
}
</script>

<style lang="less">
.awesome-cascader-list {
  @border-color: #e1e1e1;
  white-space: nowrap;
  position: relative;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid @border-color;
    display: inline-block;
    position: absolute;
    top: 0;

    li {
      padding: 4px 8px;
      font-size: 14px;
      color: #888;
      cursor: pointer;
      .one-line;

      &:not(:last-child) {
        border-bottom: 1px solid @border-color;
      }

      &:hover {
        background-color: #f6f6f6;
      }

      &.checked {
        background-color: #1c8de0;
        color: #fff;
      }
    }
  }

  .one-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
