<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '../../utils/scrollTo'
import { defineComponent, computed } from 'vue'

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
  setup(props, { emit }) {
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
    const handleSizeChange = (val) => {
      if (currentPage.value * val > props.total) {
        currentPage.value = 1
      }
      emit('pagination', { pageNum: currentPage.value, pageSize: val })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }
    const handleCurrentChange = (val) => {
      emit('pagination', { pageNum: val, pageSize: pageSize.value })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }

    return {
      currentPage,
      // eslint-disable-next-line vue/no-dupe-keys
      pageSize,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped>
.pagination-container {
  height: 64px;
  padding: 16px 0;
  margin: 0;
  position: relative;
}
.pagination-container.hidden {
  display: none;
}
</style>
