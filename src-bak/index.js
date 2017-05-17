/* eslint-disable */
import { merge, noop, createElement, delegate } from './utils'
import './styles/style.css'

const DEFAULT_SETTINGS = {
  sliceLength: 200,
  onChange: noop,
  placeholder: '请选择',
  btnStyle: { width: '100px', height: '28px' },
  itemStyle: { width: '110px' },
  showCategoryName: true,
  defaultSelected: []
}
const CLASS_PREFIX = 'awesome-cascader-'
const HOVER_CLASS = CLASS_PREFIX + 'items-container-hover'
const CONTAINER_CLASS = CLASS_PREFIX + 'container'
const BUTTON_CLASS = CLASS_PREFIX + 'toggle-btn'
const GLOBAL_CONTAINER_CLASS = CLASS_PREFIX + 'global-container'
const ITEM_CONTAINER_CLASS = CLASS_PREFIX + 'items-container'
const INNER_ITEM_CLASS = CLASS_PREFIX + 'items-container-item'
const INNER_LABEL_CLASS = CLASS_PREFIX + 'items-conteiner-label'
const ITEM_CHILDREN_CLASS = CLASS_PREFIX + 'items-container-children'

class Cascader {
  constructor (el, data, outerSettings = {}) {
    if (!data || !el) return
    this.settings = merge({}, DEFAULT_SETTINGS, outerSettings)
    this.data = data
    this.el = el
    this.eventsHandlerRemove = []
    this.mouseIn = false
    this.init()
  }

  init () {
    this.el.classList.add(CONTAINER_CLASS)
    this.createBtn()
    this.createItemsWrapper()

    const levelItems = this.createItems(this.data['0']['0'], 0)

    this.globalWrapper.appendChild(levelItems)
    this.addDomEvents()
  }

  addEvent (el, eventName, func) {
    el.addEventListener(eventName, func)
    this.eventsHandlerRemove.push(() => { el.removeEventListener(eventName, func) })
  }

  addDomEvents () {
    this.addEvent(this.globalWrapper, 'mouseenter', () => { this.mouseIn = true })
    this.addEvent(this.globalWrapper, 'mouseleave', () => { this.mouseIn = false })
    this.addEvent(document, 'click', this.docClickHandler.bind(this))

    const removeGlobalMoveDelegate = delegate(this.globalWrapper, INNER_ITEM_CLASS, 'mousemove', target => {
      [].slice.call(target.parentNode.children).forEach(item => {
        if (item.children[2] && item.children[2].classList.contains(HOVER_CLASS)) {
          item.children[2].classList.remove(HOVER_CLASS)
        }
      })
      if (target.children[2]) target.children[2].classList.add(HOVER_CLASS)
    })
    this.eventsHandlerRemove.push(removeGlobalMoveDelegate)

    const removeGlobalClickDelegate = delegate(this.globalWrapper, INNER_LABEL_CLASS, 'click', target => {
      const checkStatus = !target.parentNode.children[0].checked
      this.checkedAllChildren(target, checkStatus)
      this.checkedAllParents(target, checkStatus)
    }, true)
    this.eventsHandlerRemove.push(removeGlobalClickDelegate)
  }

  checkedAllChildren (target, checked) {
    const childItems = target.parentNode.children[2]
    if (childItems && childItems.children) {
      const itemList = [].slice.call(childItems.children)
      itemList.forEach(item => {
        item.children[0].checked = checked
        if (item.children[2]) this.checkedAllChildren(item.children[2], checked)
      })
    }
  }

  checkedAllParents (target, checked) {
    const parentItem = target.parentNode.parentNode
    const sibilingItems = [].slice.call(parentItem.children)
    const parentStatus = checked || !sibilingItems.every(item => {
      return item.children[1] !== target
        ? item.children[0].checked === false
        : true
    })
    parentItem.parentNode.children[0].checked = parentStatus
    const grandParentItem = parentItem.parentNode.parentNode.parentNode
    if (grandParentItem &&
      grandParentItem.classList &&
      grandParentItem.classList.contains(ITEM_CONTAINER_CLASS)) {
      this.checkedAllParents(grandParentItem, parentStatus)
    }
  }

  docClickHandler () {
    // 关闭所有展开项
    if (!this.mouseIn) {
      const hoverItems = [].slice.call(this.globalWrapper.querySelectorAll('.' + HOVER_CLASS))
      hoverItems.forEach(item => { item.classList.remove(HOVER_CLASS) })
    }
  }

  createBtn () {
    const btnStyle = this.settings.btnStyle
    const btn = createElement('button', {
      innerHTML: this.settings.placeholder,
      className: BUTTON_CLASS
    })

    btn.style.width = btnStyle.width
    btn.style.height = btnStyle.height
    this.el.appendChild(btn)
    this.btn = btn
  }

  createItemsWrapper () {
    const position = this.btn.getBoundingClientRect()
    const globalWrapper = createElement('div', { className: GLOBAL_CONTAINER_CLASS })
    globalWrapper.style.left = `${position.left}px`
    globalWrapper.style.top = `${position.bottom}px`
    this.globalWrapper = globalWrapper

    document.body.appendChild(globalWrapper)
  }

  createItems (items, level) {
    const itemsContainer = createElement('ul', { className: ITEM_CONTAINER_CLASS })
    if (level) itemsContainer.classList.add(ITEM_CHILDREN_CLASS)
    itemsContainer.style.width = this.settings.itemStyle.width

    items.forEach((item, index) => {
      const itemEl = createElement('li', {
        className: INNER_ITEM_CLASS
      })
      const labelEl = createElement('label', {
        innerHTML: item.n,
        htmlFor: item.i,
        className: INNER_LABEL_CLASS
      })
      const checkboxEl = createElement('input', {
        type: 'checkbox',
        name: 'checked-item',
        value: item.i,
        id: item.i
      })
      itemEl.appendChild(checkboxEl)
      itemEl.appendChild(labelEl)
      const nextLevel = level + 1

      itemEl.dataset.id = item.i

      if (this.data[nextLevel] && this.data[nextLevel][item.i]) {
        const childItems = this.createItems(this.data[nextLevel][item.i], nextLevel)
        itemEl.appendChild(childItems)
      }

      itemsContainer.appendChild(itemEl)
    })

    return itemsContainer
  }

  changeData () {
    console.log('切换数据')
  }

  destory () {
    this.eventsHandlerRemove.forEach(item => { item() })
  }
}

export default Cascader
