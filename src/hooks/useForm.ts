import { Ref } from "vue";
import {
  ElForm,
  FormItemProp,
  FormValidateCallback,
  FormValidationResult,
} from "element-plus";
import { Arrayable } from "element-plus/es/utils";

export function useForm(
  formRef: Ref<InstanceType<typeof ElForm> | undefined>
): {
  validate: (callback: (valid: boolean) => void) => void | Promise<boolean>;
  validateField: (
    props?: Arrayable<FormItemProp> | undefined,
    callback?: FormValidateCallback | undefined
  ) => FormValidationResult;
  resetFields: () => void;
  scrollToField: (prop: FormItemProp) => void;
  clearValidate: (props?: Arrayable<FormItemProp> | undefined) => void;
  fields: () => void;
  getField: (prop: FormItemProp) => any;
} {
  /**
   * 校验表单
   * @param callback 校验回调
   * @returns 校验结果
   */
  const validate = (callback: (valid: boolean) => void) => {
    return formRef.value?.validate(callback);
  };
  /**
   * 校验表单字段
   * @param props 表单字段名【非嵌套-eg: age/嵌套-eg：tableData.0.age】
   * @param callback 校验回调
   * @returns 校验结果
   */
  const validateField = (
    props?: Arrayable<FormItemProp> | undefined,
    callback?: FormValidateCallback | undefined
  ): FormValidationResult => {
    return (
      formRef.value?.validateField(props, callback) || Promise.resolve(false)
    );
  };
  /**
   * 重置表单字段
   */
  const resetFields = () => {
    formRef.value?.resetFields();
  };
  /**
   * 滚动到表单字段
   * @param prop 表单字段名【非嵌套-eg: age/嵌套-eg：tableData.0.age】
   */
  const scrollToField = (prop: FormItemProp) => {
    formRef.value?.scrollToField(prop);
  };
  /**
   * 清除表单校验
   * @param props 表单字段名【一般不传】
   */
  const clearValidate = (props?: Arrayable<FormItemProp> | undefined) => {
    formRef.value?.clearValidate(props);
  };
  /**
   * 获取表单所有字段
   * @returns 表单所有字段
   */
  const fields = () => {
    return formRef.value?.fields;
  };
  /**
   * 获取表单字段
   * @param prop 表单字段名【非嵌套-eg: age/嵌套-eg：tableData.0.age】
   * @returns 表单字段
   */
  const getField = (prop: FormItemProp) => {
    return formRef.value?.getField(prop);
  };

  return {
    validate,
    validateField,
    resetFields,
    scrollToField,
    clearValidate,
    fields,
    getField,
  };
}
