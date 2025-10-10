import { defineComponent, h, ref, resolveComponent } from "vue";
import BaseTable from "./table";
import BaseTableV2 from "./tableV2";
import { useTable } from "../../hooks/useTable";
import { useForm } from "../../hooks/useForm";

export default defineComponent({
  components: {
    BaseTable,
    BaseTableV2,
  },
  props: {
    isVirtual: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs, expose }) {
    const baseRef = ref<InstanceType<typeof BaseTable>>();
    const baseV2Ref = ref<InstanceType<typeof BaseTableV2>>();
    const getRef = () => (props.isVirtual ? baseV2Ref : baseRef);

    expose({
      ...useForm(getRef() as any),
      ...useTable(getRef() as any),
    });

    return () =>
      props.isVirtual
        ? h(
            resolveComponent("BaseTableV2"),
            { ...attrs, ref: baseV2Ref },
            { ...slots }
          )
        : h(
            resolveComponent("BaseTable"),
            { ...attrs, ref: baseRef },
            { ...slots }
          );
  },
});
