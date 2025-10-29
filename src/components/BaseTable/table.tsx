import { computed, defineComponent, h, ref, resolveComponent } from 'vue'
import { ElForm, Column, ElTable, FormItemRule } from 'element-plus'
import { useComponent } from '../../hooks/useComponent'
import { useForm } from '../../hooks/useForm'
import { useTable } from '../../hooks/useTable'
import Pagination from '../Pagination/index'
import { Scope } from '../../types/table'

export default defineComponent({
  components: {
    Pagination
  },
  props: {
    tableColumns: {
      type: Array<Column>,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array<number>,
      default: () => [10, 20, 50, 100, 500]
    },
    total: {
      type: Number,
      default: 0
    },
    isForm: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, slots, attrs, expose }) {
    const formRef = ref<InstanceType<typeof ElForm>>()
    const tableRef = ref<InstanceType<typeof ElTable>>()
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
    const pageNum = ref(props.pageNum)
    const pageSize = ref(props.pageSize)
    const showPagination = computed(() => props.total && !isFormTable.value)

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
     * 分页切换
     * @param pagination 分页参数
     */
    const handlePagination = (pagination: { pageNum: number; pageSize: number }) => {
      pageNum.value = pagination.pageNum
      pageSize.value = pagination.pageSize
      emit('pagination', pagination)
    }

    /**
     * 渲染表头
     * @param columnItem 列配置
     * @returns 表头内容
     */
    const renderHeaderSlot = (columnItem: Column) => {
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
    const renderDefaultSlot = (columnItem: Column, scope: Scope) => {
      const columnValue = scope.row[columnItem.prop as string]
      try {
        const updateFunc = (columnItem: Column, value: unknown) => {
          scope.row[columnItem.prop as string] = value
        }
        const renderType = columnItem.renderType
        const specialRenderTypes = ['index', 'selection', 'expand', 'slot']
        const specialRenderMap = {
          index: () => renderIndex(scope.$index),
          selection: () => renderSelection(),
          expand: () => renderSlot(columnItem, scope),
          slot: () => renderSlot(columnItem, scope)
        }
        if (specialRenderTypes.includes(renderType)) {
          return specialRenderMap[renderType as keyof typeof specialRenderMap]()
        }
        const dynamicComponent = getDynamicComponent(isFormTable.value, columnItem, columnValue, updateFunc, scope)
        const curProp = `tableData.${scope.$index}.${columnItem.prop}`
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
    const renderIndex = (index: number) => {
      return (pageNum.value - 1) * pageSize.value + index + 1
    }

    /**
     * 渲染选择列
     * @returns 选择列内容
     */
    const renderSelection = () => {
      return null
    }

    /**
     * 渲染插槽
     * @param columnItem 列配置
     * @param scope 行数据
     * @returns 插槽内容
     */
    const renderSlot = (columnItem: Column, scope: Scope) => {
      return getSlotsComponent(columnItem, slots, scope)
    }

    /**
     * 渲染表格列
     * @param columnItem 列配置
     * @param columnAttr 列属性
     * @param scp 作用域
     * @returns 表格列内容
     */
    const renderTableColumn = (columnItem: any, columnAttr: Column | Record<string, any>, scp?: Scope) => {
      const renderType = columnItem.renderType || undefined
      const columnSlot: any = renderType
        ? {
            header: () => {
              return renderHeaderSlot(columnItem)
            },
            default: (scope: Scope) => {
              return renderDefaultSlot(columnItem, scope)
            }
          }
        : null
      if (columnItem.children && Array.isArray(columnItem.children)) {
        const newColumnAttr = { ...columnAttr }
        delete newColumnAttr.children
        return h(resolveComponent('el-table-column'), newColumnAttr, () =>
          columnItem.children.map((child: Column) => renderTableColumn(child, child, scp))
        )
      }
      return h(resolveComponent('el-table-column'), { ...columnAttr }, columnSlot)
    }

    /**
     * 渲染基础表格
     * @returns 表格内容
     */
    const renderTable = () => {
      const tableColumnsArr = tableColumns.value.map((columnItem: Column) => {
        const renderType = columnItem.renderType
        const basicAttr = { key: columnItem.prop, ...columnItem }
        const selectionAttr = { type: 'selection' }
        const expandAttr = { type: 'expand' }
        const renderAttr = {
          ...basicAttr,
          ...(renderType === 'selection' ? selectionAttr : {}),
          ...(renderType === 'expand' ? expandAttr : {})
        }
        const columnAttr = renderType ? renderAttr : basicAttr
        return renderTableColumn(columnItem, columnAttr)
      })
      const tableSlots: Record<string, any> = {
        default: () => tableColumnsArr
      }
      Object.keys(slots).forEach((slotName) => {
        if (slotName !== 'default') {
          tableSlots[slotName] = (slotProps?: Record<string, any>) => slots[slotName]?.(slotProps)
        }
      })
      return h(
        resolveComponent('el-table'),
        {
          ...attrs,
          data: isFormTable.value ? formData.value.tableData : tableData.value,
          ref: tableRef
        },
        tableSlots
      )
    }

    /**
     * 渲染分页
     * @returns 分页内容
     */
    const renderPagination = () => {
      if (!showPagination.value) return null
      return h(resolveComponent('pagination'), {
        total: props.total,
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        pageSizes: props.pageSizes,
        onPagination: handlePagination
      })
    }

    /*
     * 渲染数据表格【适用于展示类的表格】
     * @returns 数据表格内容
     */
    const renderDataTable = () => {
      return h('div', null, [renderTable(), renderPagination()])
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

    expose({
      ...useForm(formRef),
      ...useTable(tableRef)
    })

    return () => (isFormTable.value ? renderFormTable() : renderDataTable())
  }
})
