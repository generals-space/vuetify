import Ripple from './ripple'

export {
  Ripple
}

export default function install (Vue) {
  Vue.directive('ripple', Ripple)
}
