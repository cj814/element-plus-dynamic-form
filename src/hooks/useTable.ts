import { Ref } from 'vue'
import { ElTable } from 'element-plus'

export function useTable(tableRef: Ref<InstanceType<typeof ElTable> | undefined>) {
  /**
   * 清空选中行
   */
  const clearSelection = () => {
    tableRef.value?.clearSelection()
  }

  /**
   * 获取选中行
   * @returns 选中行数组
   */
  const getSelectionRows = () => {
    return tableRef.value?.getSelectionRows() || []
  }

  /**
   * 切换行选中状态
   * @param row 行数据
   * @param selected 是否选中
   * @param ignoreSelectable 是否忽略可选择
   */
  const toggleRowSelection = (row: Record<string, unknown>, selected?: boolean, ignoreSelectable = true) => {
    tableRef.value?.toggleRowSelection(row, selected, ignoreSelectable)
  }

  /**
   * 切换所有行选中状态
   */
  const toggleAllSelection = () => {
    tableRef.value?.toggleAllSelection()
  }

  /**
   * 切换行展开状态
   * @param row 行数据
   * @param expanded 是否展开
   */
  const toggleRowExpansion = (row: Record<string, unknown>, expanded?: boolean) => {
    tableRef.value?.toggleRowExpansion(row, expanded)
  }

  /**
   * 设置当前行
   * @param row 行数据
   */
  const setCurrentRow = (row: Record<string, unknown>) => {
    tableRef.value?.setCurrentRow(row)
  }

  /**
   * 清空排序
   */
  const clearSort = () => {
    tableRef.value?.clearSort()
  }

  /**
   * 清空筛选
   * @param columnKeys 列键数组
   */
  const clearFilter = (columnKeys?: string[]) => {
    tableRef.value?.clearFilter(columnKeys)
  }

  /**
   * 执行布局
   */
  const doLayout = () => {
    tableRef.value?.doLayout()
  }

  /**
   * 排序
   * @param column 列数据
   * @param sortOrders 排序顺序数组
   */
  const sort = (column: any, sortOrders: any) => {
    tableRef.value?.sort(column, sortOrders)
  }

  /**
   * 滚动到指定位置
   * @param options 滚动选项
   * @param yCoord 垂直坐标
   */
  const scrollTo = (options: number | ScrollToOptions, yCoord?: number) => {
    tableRef.value?.scrollTo(options, yCoord)
  }

  /**
   * 设置滚动顶部
   * @param top 顶部坐标
   */
  const setScrollTop = (top?: number) => {
    tableRef.value?.setScrollTop(top)
  }

  /**
   * 设置滚动左侧
   * @param left 左侧坐标
   */
  const setScrollLeft = (left?: number) => {
    tableRef.value?.setScrollLeft(left)
  }

  /**
   * 获取列数据
   * @returns 列数据数组
   */
  const columns = () => {
    return tableRef.value?.columns || []
  }

  /**
   * 更新指定键的子项
   * @param key 键值
   * @param children 子项数组
   */
  const updateKeyChildren = (key: string, children: any[]) => {
    tableRef.value?.updateKeyChildren(key, children)
  }

  return {
    clearSelection,
    getSelectionRows,
    toggleRowSelection,
    toggleAllSelection,
    toggleRowExpansion,
    setCurrentRow,
    clearSort,
    clearFilter,
    doLayout,
    sort,
    scrollTo,
    setScrollTop,
    setScrollLeft,
    columns,
    updateKeyChildren
  }
}
