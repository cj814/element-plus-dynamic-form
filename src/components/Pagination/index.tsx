import { defineComponent, computed, h, resolveComponent } from 'vue'
import { scrollTo } from '../../utils/scrollTo'

export default defineComponent({
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
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
      type: Array,
      default() {
        return [10, 20, 50, 100, 500]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, expose }) {
    const currentPage = computed({
      get() {
        return props.pageNum
      },
      set(val) {
        emit('update-pageNum', val)
      }
    })
    const pageSize = computed({
      get() {
        return props.pageSize
      },
      set(val) {
        emit('update-pageSize', val)
      }
    })
    const handleSizeChange = (val: number) => {
      if (currentPage.value * val > props.total) {
        currentPage.value = 1
      }
      emit('pagination', { pageNum: currentPage.value, pageSize: val })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }
    const handleCurrentChange = (val: number) => {
      emit('pagination', { pageNum: val, pageSize: pageSize.value })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }

    expose({
      handleSizeChange,
      handleCurrentChange
    })

    return () =>
      h(
        'div',
        {
          className: 'pagination-container',
          style: { paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }
        },
        h(resolveComponent('el-pagination'), {
          currentPage: currentPage.value,
          pageSize: pageSize.value,
          background: props.background,
          layout: props.layout,
          pageSizes: props.pageSizes as number[],
          total: props.total,
          onSizeChange: handleSizeChange,
          onCurrentChange: handleCurrentChange
        })
      )
  }
})
