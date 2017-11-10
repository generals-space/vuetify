import VEditor from './VEditor.vue'

VEditor.install = function install (Vue) {
  Vue.component(VEditor.name, VEditor)
}

export default VEditor
