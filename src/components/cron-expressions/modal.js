import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

export default Form.create()(({
  dispatch,
  form,
  unit,
}) => {
  const { getFieldDecorator } = form;
  const handleCancel = () => dispatch({
    type: 'cron/stateWillUpdate',
    payload: {
      visible: false,
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'cron/stateWillUpdate',
          payload: {
            intervalPeriod: values.number,
            unit: values.unit,
            visible: false,
          },
        });
      }
    });
  };
  return (
    <Modal
      visible
      maskClosable={false}
      title="重复设置 - 自定义时间"
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form layout="inline">
        <FormItem>每</FormItem>
        <FormItem>
          {getFieldDecorator('number', {
            rules: [
              { required: true, message: '请输入数量!' },
            ],
          })(
            <Input style={{ width: '88px' }} placeholder="数量" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('unit', {
            initialValue: unit,
            rules: [{
              required: true, message: '请选择单位!',
            }],
          })(
            <Select style={{ width: '88px' }} placeholder="单位">
              <Option value="天">天</Option>
              <Option value="月">月</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem>重复执行任务</FormItem>
      </Form>
    </Modal>
  );
});
