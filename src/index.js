import { merge, noop, createElement, delegate } from './utils'
import './styles/style.css'

const defaultSettings = {
  sliceLength: 200,
  onChange: noop,
  placeholder: '请选择',
  btnStyle: { width: '100px', height: '28px' },
  itemStyle: { width: '110px' },
  showCategoryName: true
}

const hoverClass = 'awesome-cascader-items-container-hover'

class Cascader {
  constructor (el, data, outerSettings = {}) {
    if (!data || !el) return
    this.settings = merge({}, defaultSettings, outerSettings)
    this.data = data
    this.el = el
    this.init()
  }

  init () {
    this.el.classList.add('awesome-cascader-container')
    this.createBtn()
    this.createItemsWrapper()

    const levelItems = this.createItems(this.data['0']['0'])

    this.globalWrapper.appendChild(levelItems)
  }

  createBtn () {
    const btnStyle = this.settings.btnStyle
    const btn = createElement('button', {
      innerHTML: this.settings.placeholder,
      className: 'awesome-cascader-toggle-btn'
    })

    btn.style.width = btnStyle.width
    btn.style.height = btnStyle.height
    this.el.appendChild(btn)
    this.btn = btn
  }

  createItemsWrapper () {
    const position = this.btn.getBoundingClientRect()
    const globalWrapper = createElement('div', {
      className: 'awesome-cascader-global-container'
    })

    globalWrapper.style.left = `${position.left}px`
    globalWrapper.style.top = `${position.bottom}px`

    this.globalWrapper = globalWrapper

    document.body.appendChild(globalWrapper)
  }

  createItems (items) {
    const itemsContainer = createElement('ul', {
      className: 'awesome-cascader-items-container'
    })

    delegate(itemsContainer, 'awesome-cascader-items-container-item', 'mousemove', (target) => {
      [].slice.call(target.parentNode.children).forEach(item => {
        if (item.children[0].classList.contains(hoverClass)) item.children[0].classList.remove(hoverClass)
      })
      target.children[0].classList.add(hoverClass)
    })

    itemsContainer.style.width = this.settings.itemStyle.width

    items.forEach((item, index) => {
      const itemEl = createElement('li', {
        innerHTML: item.n,
        className: 'awesome-cascader-items-container-item'
      })

      itemEl.dataset.id = item.i

      const childContainer = createElement('ul', {
        className: 'awesome-cascader-items-container-children awesome-cascader-items-container'
      })

      childContainer.style.width = this.settings.itemStyle.width

      items.forEach(item => {
        const itemEl = createElement('li', {
          innerHTML: item.n + index
        })
        itemEl.dataset.id = item.i
        childContainer.appendChild(itemEl)
      })

      itemEl.appendChild(childContainer)

      itemsContainer.appendChild(itemEl)
    })

    return itemsContainer
  }

  changeData () {
    console.log('切换数据')
  }
}

export default Cascader
