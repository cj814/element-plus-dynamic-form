import type { ColProps, FormItemProps, TableColumnCtx } from 'element-plus'

type MethodName = `on${Capitalize<string>}`
type ItemColProps = Partial<ColProps>
type ItemProps = Partial<FormItemProps>
type ComProps = Record<string, any>
type ComEvents = {
  [K in MethodName]?: Function
}
type CommonProp = { renderType: string; itemProps?: ItemProps; comProps?: ComProps; comEvents?: ComEvents }
export type FormRenderItem = CommonProp | { colProps?: ItemColProps }
export type BaseTableColumn = CommonProp & TableColumnCtx & { children?: BaseTableColumn[] }
