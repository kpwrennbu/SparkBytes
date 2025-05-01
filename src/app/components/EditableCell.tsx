import { Input, InputNumber, Form } from 'antd';
import type { EditableCellProps } from '@/types';

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}: EditableCellProps & React.TdHTMLAttributes<HTMLTableCellElement>) => {
  const inputNode = inputType === 'number' ? <InputNumber min={1} /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please input valid ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
