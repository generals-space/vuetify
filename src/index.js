require('./stylus/app.styl')
import Semver from 'semver'
import { devDependencies, version } from '../package.json'
import * as components from './components'

function Vuetify (Vue) {
  const Vuetify = components.Vuetify

  Vue.use(Vuetify, {
    components
  })
}

Vuetify.version = version

function checkVueVersion () {
  const vueDep = devDependencies.vue
  if (!Semver.satisfies(window.Vue.version, vueDep)) {
    console.warn(`Vuetify requires Vue version ${vueDep}`)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.version && checkVueVersion()
  window.Vue.use(Vuetify)
}

export default Vuetify
