## Project Install

安装依赖

```
npm i -g yarn
yarn 
```

修改源码后构建

```
npm run build
```

## Use

```javascript
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
```

```html
<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
<link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet">
```

```javascript
require('/path/to/node_modules/vuetify/dist/vuetify.min.css')
```

实际上vue引入`vuetify`的包时, 生效的实际是`node_modules/vuetify/dist/*`下的文件, 替换一下就可以用了.