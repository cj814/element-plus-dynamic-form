import { computed, defineComponent, FunctionalComponent, h, ref, resolveComponent, unref, VNode } from 'vue'
import { ElForm, Column, ElCheckbox, CheckboxValueType, ElTableV2, FormItemRule } from 'element-plus'
import { ScopeV2, SelectionCellProps, HeaderRenderProps, CellRenderProps } from '../../types/table'
import { useComponent } from '../../hooks/useComponent'
import { useForm } from '../../hooks/useForm'
import { useTableV2 } from '../../hooks/useTableV2'

export default defineComponent({
  props: {
    tableColumns: {
      type: Array<Column>,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    isForm: {
      type: Boolean,
      default: false
    },
    isAutoResize: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots, attrs, expose }) {
    const formRef = ref<InstanceType<typeof ElForm>>()
    const tableRef = ref<InstanceType<typeof ElTableV2>>()
    const { getDynamicComponent, getSlotsComponent } = useComponent()
    const isFormTable = computed(() => props.isForm)
    const formData = computed(() => ({ tableData: props.tableData }))
    const tableData = computed(() => props.tableData)
    const allTableColumns = computed(() => props.tableColumns)
    const tableColumns = computed(() => {
      return allTableColumns.value.filter((columnItem: Column) => {
        return columnItem.visible || !Object.prototype.hasOwnProperty.call(columnItem, 'visible')
      })
    })

    /**计算每列是否必填 */
    const columnRequiredMap = computed(() => {
      const map = new Map()
      tableColumns.value.forEach((columnItem: Column) => {
        const rules = columnItem.itemProps?.rules || []
        const isRequired = rules.some((rule: FormItemRule) => rule.required)
        map.set(columnItem.prop, isRequired || false)
      })
      return map
    })

    /**
     * 渲染表头
     * @param columnItem 列配置
     * @returns 表头内容
     */
    const renderHeaderCell = (columnItem: Column, scope: HeaderRenderProps<ScopeV2>): VNode => {
      const renderType = columnItem.renderType
      const specialRenderTypes = ['selection']
      const specialRenderMap = {
        selection: () => renderSelection(scope, 'header')
      }
      if (specialRenderTypes.includes(renderType)) {
        return specialRenderMap[renderType as keyof typeof specialRenderMap]()
      }
      if (isFormTable.value) {
        const isRequired = columnRequiredMap.value.get(columnItem.prop)
        const requiredStyle = {
          color: 'red',
          position: 'relative',
          top: '2px',
          marginRight: '2px'
        }
        if (isRequired) {
          return h('span', null, [h('span', { style: requiredStyle }, '*'), h('span', null, columnItem.label)])
        }
      }
      return columnItem.label
    }

    /**
     * 渲染表体
     * @param columnItem 列配置
     * @param scope 行数据
     * @returns 表体内容
     */
    const renderDefaultCell = (columnItem: Column, scope: any) => {
      const columnValue = scope.rowData[columnItem.prop as string]
      try {
        const updateFunc = (columnItem: Column, value: any) => {
          scope.rowData[columnItem.prop as string] = value
        }
        const renderType = columnItem.renderType
        const specialRenderTypes = ['index', 'selection', 'slot']
        const specialRenderMap = {
          index: () => renderIndex(scope.rowIndex),
          selection: () => renderSelection(scope, 'default'),
          slot: () => renderSlot(columnItem, scope)
        }
        if (specialRenderTypes.includes(renderType)) {
          return specialRenderMap[renderType as keyof typeof specialRenderMap]()
        }
        const dynamicComponent = getDynamicComponent(isFormTable.value, columnItem, columnValue, updateFunc, scope)
        const curProp = `tableData.${scope.rowIndex}.${columnItem.prop}`
        if (isFormTable.value) {
          return h(
            resolveComponent('el-form-item'),
            {
              ...columnItem.itemProps,
              prop: curProp
            },
            () => dynamicComponent
          )
        } else {
          return dynamicComponent
        }
      } catch (err) {
        return columnValue
      }
    }

    /**
     * 渲染索引列
     * @param index 行索引
     * @returns 索引值
     */
    const renderIndex = (rowIndex: number) => {
      return rowIndex + 1
    }

    /**
     * 渲染选择列
     * @returns 选择列内容
     */
    const renderSelection = (
      scope: CellRenderProps<ScopeV2> | HeaderRenderProps<ScopeV2>,
      part: 'header' | 'default'
    ) => {
      const SelectionCell: FunctionalComponent<SelectionCellProps> = ({ value, intermediate = false, onChange }) => {
        return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
      }

      const selectionCellMap = {
        header: () => {
          const _tableData = unref(tableData)
          const onChange = (value: CheckboxValueType) =>
            _tableData.forEach((row: any) => {
              row.checked = value
              return row
            })
          const allSelected = _tableData.every((row: any) => row.checked)
          const containsChecked = _tableData.some((row: any) => row.checked)
          return (
            <SelectionCell value={allSelected} intermediate={containsChecked && !allSelected} onChange={onChange} />
          )
        },
        default: () => {
          const { rowData } = scope as unknown as CellRenderProps<ScopeV2>
          const onChange = (value: CheckboxValueType) => (rowData.checked = value)
          return <SelectionCell value={rowData.checked} onChange={onChange} />
        }
      }

      return selectionCellMap[part]()
    }

    /**
     * 渲染插槽
     * @param columnItem 列配置
     * @param scope 行数据
     * @returns 插槽内容
     */
    const renderSlot = (columnItem: Column, scope: CellRenderProps<ScopeV2>) => {
      return getSlotsComponent(columnItem, slots, scope)
    }

    /**
     * 渲染基础表格
     * @param resizeParams 表格尺寸参数
     * @returns 表格内容
     */
    const renderBasicTable = (resizeParams?: { width?: number; height?: number }) => {
      const columns = transferColumns(tableColumns.value)
      return h(
        resolveComponent('el-table-v2'),
        {
          ...attrs,
          ...(resizeParams || {}),
          columns,
          data: isFormTable.value ? formData.value.tableData : tableData.value,
          ref: tableRef
        },
        {
          ...slots
        }
      )
    }

    /**
     * 渲染自适应表格
     * @returns 表格内容
     */
    const renderResizeTable = () => {
      return h(resolveComponent('el-auto-resizer'), null, {
        default: ({ height, width }: { height: number; width: number }) => renderBasicTable({ height, width })
      })
    }

    /**
     * 渲染表格
     * @returns 表格内容
     */
    const renderTable = () => {
      return props.isAutoResize ? renderResizeTable() : renderBasicTable()
    }

    /**
     * 渲染数据表格【适用于展示类的表格】
     * @returns 数据表格内容
     */
    const renderDataTable = () => {
      return h('div', null, [renderTable()])
    }

    /**
     * 渲染表单表格【适用于表单提交类的表格】
     * @returns 表单表格内容
     */
    const renderFormTable = () => {
      return h(
        resolveComponent('el-form'),
        {
          model: formData.value,
          ref: formRef
        },
        renderTable
      )
    }

    /**
     * 转换列属性
     * @param column 列配置
     * @returns 转换后的列配置
     */
    const transferColumnProperty = (column: Column) => {
      const hasTitle = Object.prototype.hasOwnProperty.call(column, 'title')
      const hasLabel = Object.prototype.hasOwnProperty.call(column, 'label')
      const hasDataKey = Object.prototype.hasOwnProperty.call(column, 'dataKey')
      const hasProp = Object.prototype.hasOwnProperty.call(column, 'prop')
      if (!hasTitle && hasLabel) column.title = column.label
      if (!hasDataKey && hasProp) column.dataKey = column.prop
      return column
    }

    /**
     * 自定义单元格
     * @param columns 列配置列表
     * @returns 转换后的列配置列表
     */
    const transferColumns = (columns: Column[]) => {
      return columns.map((column) => {
        column = transferColumnProperty(column)
        column.headerCellRenderer = (scope: HeaderRenderProps<ScopeV2>) => renderHeaderCell(column, scope)
        column.cellRenderer = (scope: CellRenderProps<ScopeV2>) => renderDefaultCell(column, scope)
        return column
      })
    }

    expose({
      ...useForm(formRef),
      ...useTableV2(tableRef)
    })

    return () => (isFormTable.value ? renderFormTable() : renderDataTable())
  }
})
