import { RenderRowData, TableV2RowProps, CheckboxValueType, Column } from 'element-plus'

export type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}
export type Scope = RenderRowData<Record<string, unknown>>
export type ScopeV2 = TableV2RowProps
export type HeaderRenderProps<T> = {
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  headerIndex: number
}
export type CellRenderProps<T> = {
  cellData: T
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  rowData: any
  rowIndex: number
}
