# Element Plus Dynamic Form

基于 Element Plus 的动态表单/动态表格，支持通过配置快速生成表单/表格。

## 安装

```bash
npm install element-plus-dynamic-form
```

## 快速开始

### 1. 安装依赖

```bash
npm install element-plus-dynamic-form element-plus
```

### 2. 引入样式

```typescript
// 在你的 main.ts 或入口文件中引入 Element Plus 样式
import 'element-plus/dist/index.css'
```

### 3. 使用组件

> #### 动态表单【FormRender】

#### 说明

| 属性          | 释义              | 说明                                                                                                  |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `formItems`   | 表单配置项        | FormRender 自身属性                                                                                   |
| `formData`    | 表单数据          | FormRender 自身属性                                                                                   |
| `baseColSpan` | 基础列宽度        | FormRender 自身属性，默认 8                                                                           |
| `renderType`  | 表单项组件类型    | 表单项属性，可以为 element-plus 组件，如(el-input,el-select 等)，也可以为自定义组件                   |
| `colProps`    | el-col 属性       | 表单项属性，参考 [el-col](https://cn.element-plus.org/zh-CN/component/layout#col-api)                 |
| `itemProps`   | el-form-item 属性 | 表单项属性，参考 [el-form-item](https://cn.element-plus.org/zh-CN/component/form#formitem-attributes) |
| `comProps`    | 组件属性          | 表单项属性，参考 el-input、el-select 或自定义组件等自身属性                                           |
| `comEvents`   | 组件事件          | 表单项属性，参考 el-input、el-select 或自定义组件等自身事件，如 onBlur,onChange 等                    |

<br />

> 注：
>
> - FormRender 自身属性除了 formItems、formData、baseColSpan 外，el-form 自身的属性也可透传，如 model、rules、label-width 等。
> - 如需插槽，可以使用 template 插槽或 jsx 插槽，使用 jsx 插槽时，script 标签需要添加 lang="tsx"。

#### 示例

```html
<template>
  <form-render :form-items="formItems" :form-data="formData" ref="formRenderRef">
    <template #testDemo>
      <test-demo @click="handleClick" />
    </template>
    <template #fileList>
      <el-upload
        v-model:file-list="formData.fileList"
        class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="3"
        :on-exceed="handleExceed"
      >
        <el-button type="primary">上传图片</el-button>
        <template #tip>
          <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
        </template>
      </el-upload>
    </template>
  </form-render>
</template>

<script setup lang="tsx">
  import TestDemo from './testDemo.vue' // 自定义组件
  const formRenderRef = ref<InstanceType<typeof ElForm>>()
  const formItems = computed(() => [
    {
      renderType: 'el-input',
      colProps: {
        span: 12
      },
      itemProps: {
        prop: 'name',
        label: '姓名'
      },
      comProps: {
        placeholder: '请输入姓名',
        slots: {
          prepend: () => <div onClick={() => alert(111)}>https://</div>
        }
      },
      comEvents: {
        onBlur: () => {
          // formData.value.age = 19;
          // ageLabel.value = "年龄1111";
          ageRequired.value = false
        }
      }
    },
    {
      renderType: 'el-input',
      itemProps: {
        prop: 'age',
        label: ageLabel.value,
        rules: [
          {
            required: ageRequired.value,
            message: '请输入年龄',
            trigger: ['blur']
          }
        ]
      }
    },
    {
      renderType: 'dict-select', // dict-select为自定义组件
      itemProps: {
        prop: 'scaleType',
        label: '性别'
      },
      comProps: {
        dictKey: 'SUBJECT_BIDDING'
      },
      comEvents: {
        onChange: (val: string) => {
          console.log(val)
        },
        onClear: () => {
          console.log('clear')
        }
      }
    },
    {
      renderType: 'slot',
      itemProps: {
        label: '插槽',
        prop: 'testDemo'
      }
    },
    {
      renderType: 'slot',
      itemProps: {
        prop: 'fileList',
        label: '图片',
        rules: [
          {
            required: true,
            message: '请上传图片',
            trigger: ['change']
          }
        ]
      }
    },
    // 对于稍复杂的组件，需要自定义插槽，可以使用template插槽【如fileList】，也可以使用jsx插槽【如fileList2】
    {
      renderType: 'el-upload',
      itemProps: {
        prop: 'fileList2',
        label: '图片2',
        rules: [
          {
            required: true,
            message: '请上传图片',
            trigger: ['change']
          }
        ]
      },
      comProps: {
        action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
        multiple: true,
        modelName: 'fileList',
        fileList: formData.value.fileList2,
        onPreview: handlePreview,
        onRemove: handleRemove,
        beforeRemove: beforeRemove,
        onExceed: handleExceed,
        limit: 3,
        slots: {
          default: () => (
            <div>
              <div>{ageLabel.value}</div>
              <el-button type="primary">
                <div>222</div>
              </el-button>
            </div>
          )
        }
      }
    },
    {
      renderType: 'el-input-number',
      itemProps: {
        prop: 'value1',
        label: '数字',
        rules: [
          {
            required: true,
            message: '请输入数字',
            trigger: ['blur']
          }
        ]
      },
      comProps: {
        slots: {
          'decrease-icon': () => (
            <el-icon onClick={() => alert('ArrowDown')}>
              <ArrowDown />
            </el-icon>
          ),
          'increase-icon': () => (
            <el-icon onClick={() => alert('ArrowUp')}>
              <ArrowUp />
            </el-icon>
          )
        }
      }
    }
  ])

  const formData = ref({
    name: '',
    age: '',
    scaleType: '',
    fileList: [
      {
        name: 'element-plus-logo.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg'
      },
      {
        name: 'element-plus-logo2.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg'
      }
    ],
    fileList2: [
      {
        name: 'element-plus-logo.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg'
      },
      {
        name: 'element-plus-logo2.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg'
      }
    ],
    value1: ''
  })
</script>
```
