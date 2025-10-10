import { Ref } from "vue";
import { ElTableV2 } from "element-plus";

export function useTableV2(
  tableRef: Ref<InstanceType<typeof ElTableV2> | undefined>
) {
  /**
   * 滚动到指定位置
   */
  const scrollTo = (param: { scrollLeft?: number; scrollTop?: number }) => {
    (tableRef.value as any)?.scrollTo(param);
  };

  /**
   * 滚动到给定的水平位置
   * @param scrollLeft
   */
  const scrollToLeft = (scrollLeft: number) => {
    (tableRef.value as any)?.scrollToLeft(scrollLeft);
  };

  /**
   * 滚动到给定的垂直位置
   * @param scrollTop
   */
  const scrollToTop = (scrollTop: number) => {
    (tableRef.value as any)?.scrollToTop(scrollTop);
  };

  /**
   * 使用给定的滚动策略滚动至指定行
   * @param row
   * @param strategy
   */
  const scrollToRow = (
    row: number,
    strategy?: "center" | "end" | "start" | "smart"
  ) => {
    (tableRef.value as any)?.scrollToRow(row, strategy);
  };

  return {
    scrollTo,
    scrollToLeft,
    scrollToTop,
    scrollToRow,
  };
}
