#### Design 组件实现

- xxxPreview.vue
- xxxEditor.vue
- index.js

`Preview.vue` 预览组件，`Editor.vue` 编辑组件，各自实现自己的逻辑

`Preview.vue`

1. 混入 mixins `base/minxins/previewMixins.js`
2. 留一个 `<slot>`

`Editor.vue`

1. 混入 mixins `base/minxins/editorMixins.js`
2. `designValue` 为组件的值 (Object)，用作表单双向绑定，组件的值根据每个功能组件具体需求实现

`index.js`

1. 引入预览组件和编辑组件
2. 引入高阶组件 `base/combineComponents.js`将组价合并
3. 定义组件属性：`designType`, `designDescription`
4. 定义组件初始值
