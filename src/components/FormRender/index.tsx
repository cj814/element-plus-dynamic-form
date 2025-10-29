import { defineComponent, ref, watch, computed } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus'
import { useComponent } from '../../hooks/useComponent'
import { useForm } from '../../hooks/useForm'

export default defineComponent({
  name: 'FormRender',
  props: {
    // 表单配置项
    formItems: {
      type: Array as () => Array<Record<string, any>>,
      default: () => []
    },
    // 表单数据
    formData: {
      type: Object as () => Object,
      default: () => {}
    },
    // 基础列宽度
    baseColSpan: {
      type: Number,
      default: 24
    }
  },
  setup(props, { attrs, slots, expose }) {
    const formRef = ref<InstanceType<typeof ElForm>>()
    const { getDynamicComponent } = useComponent()
    const allFormItems = ref(props.formItems)
    const visibleFormItems = computed(() => {
      return allFormItems.value.filter((formItem) => formItem.visible !== false)
    })
    const formData = ref(props.formData)

    watch(
      () => [props.formData, props.formItems],
      ([newForm, newItems]) => {
        formData.value = newForm
        allFormItems.value = newItems as Array<Record<string, any>>
      },
      { deep: true }
    )

    expose({
      ...useForm(formRef)
    })

    return () => (
      <ElForm ref={formRef} model={formData.value} inline={true} labelPosition="top" {...attrs}>
        <ElRow gutter={16} style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          {visibleFormItems.value.map((item, index) => (
            <ElCol key={index} span={item.colProps?.span || props.baseColSpan} {...(item.colProps || {})}>
              <ElFormItem {...(item.itemProps || {})}>
                {(() => {
                  if (item.renderType === 'slot') {
                    return slots[item.itemProps?.prop]?.()
                  } else {
                    const formItemValue = (formData.value as Record<string, any>)[item.itemProps?.prop]
                    const updateFunc = (configItem: any, value: any) => {
                      // eslint-disable-next-line no-extra-semi
                      ;(formData.value as Record<string, any>)[configItem.itemProps?.prop] = value
                    }
                    return () => getDynamicComponent(true, item, formItemValue, updateFunc)
                  }
                })()}
              </ElFormItem>
            </ElCol>
          ))}
        </ElRow>
      </ElForm>
    )
  }
})
