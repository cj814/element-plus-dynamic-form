import { h, resolveComponent } from 'vue'
import { RenderRowData, TableV2RowProps } from 'element-plus'
import { Scope } from '../types/table'

export function useComponent() {
  /**
   * 获取动态组件
   * @param componentMode 组件模式
   * @param configItem 组件配置项
   * @param configValue 组件值
   * @param updateFunc 更新函数
   * @returns 组件
   */
  const getDynamicComponent = (
    isForm: boolean,
    configItem: any,
    configValue: any,
    updateFunc: (configItem: any, value: any) => void,
    scope?: TableV2RowProps | RenderRowData<Record<string, unknown>>
  ) => {
    const allEvents = configItem.comEvents || {}
    const componentMode = isForm ? 'hasForm' : 'noForm'
    const dynamicRenderMap = {
      noForm: () => getNoFormComponent(configItem, configValue, scope),
      hasForm: () => getFormComponent(configItem, configValue, allEvents, updateFunc)
    }
    return dynamicRenderMap[componentMode as keyof typeof dynamicRenderMap]()
  }

  /**
   * 获取动态组件【无form模式】
   * @param configItem 组件配置项
   * @param configValue 组件值
   * @returns 组件
   */
  const getNoFormComponent = (configItem: any, configValue: any, scope?: any) => {
    try {
      const formatter = configItem.comProps?.formatter || null
      return formatter ? formatter(configItem, scope) : configValue
    } catch (err) {
      return configValue
    }
  }

  /**
   * 获取动态组件【有form模式】
   * @param configItem 组件配置项
   * @param configValue 组件值
   * @param allEvents 事件
   * @returns 组件
   */
  const getFormComponent = (
    configItem: any,
    configValue: any,
    allEvents: Record<string, (val: any) => void>,
    updateFunc: (configItem: any, value: any) => void
  ) => {
    const modelName = configItem.comProps?.modelName || 'modelValue'
    return h(
      resolveComponent(configItem.renderType),
      {
        [modelName]: configValue,
        [`onUpdate:${modelName}`]: (value: any) => {
          updateFunc(configItem, value)
        },
        ...configItem.comProps,
        ...allEvents
      },
      {
        ...renderHFuncSlot(configItem)
      }
    )
  }

  /**
   * 获取组件插槽
   * @param configItem 组件配置项
   * @param slots 插槽
   * @param scope 作用域
   * @returns 插槽
   */
  const getSlotsComponent = (configItem: any, slots?: any, scope?: any) => {
    const renderType = configItem.renderType
    const comSlots = configItem.comProps?.slots || {}
    const comSlotsLength = Object.keys(comSlots).length
    const slotTypeList = comSlotsLength ? ['slot'] : ['slot', 'expand']
    return comSlotsLength
      ? renderJsxSlot(comSlots, scope)
      : slotTypeList.includes(renderType)
      ? renderTemplateSlot(configItem, slots, scope)
      : null
  }

  /**
   * 渲染模板插槽
   * @param configItem 组件配置项
   * @param slots 插槽
   * @param scope 作用域
   * @returns 插槽内容
   */
  const renderTemplateSlot = (configItem: any, slots?: any, scope?: any) => {
    const slotName = configItem.prop
    return slotName && slots?.[slotName] ? slots[slotName]?.(scope) : null
  }

  /**
   * 渲染jsx插槽
   * @param comSlots 组件插槽
   * @returns 插槽内容
   */
  const renderJsxSlot = (comSlots: Record<string, any>, scope?: Scope) => {
    return Object.keys(comSlots).map((slot) => comSlots[slot]?.(scope))
  }

  /**
   * 渲染h函数插槽
   * @param configItem 组件配置项
   * @returns 插槽内容
   */
  const renderHFuncSlot = (configItem: any) => {
    const slots = Object.keys(configItem.comProps?.slots || {})
    const slotProps = slots.reduce((acc: any, slot) => {
      acc[slot] = configItem.comProps.slots[slot]
      return acc
    }, {})
    return slotProps
  }

  return {
    getDynamicComponent,
    getSlotsComponent
  }
}
