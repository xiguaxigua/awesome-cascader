import Cascader from '../src/index'
import data from './data'
import data1 from './data1'

const settings = {
  onChange: function () { console.log('参数：' + arguments) },
  sliceLength: 201
}
let sign = false
/* eslint-disable no-new */
const cascader = new Cascader(document.getElementById('tree'), data, settings)

const toggleBtn = document.querySelector('.toggle-data')
toggleBtn.addEventListener('click', () => {
  sign = !sign
  const dataNow = sign ? data : data1
  cascader.changeData(dataNow)
})
