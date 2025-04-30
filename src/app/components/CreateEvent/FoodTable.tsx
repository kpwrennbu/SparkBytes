import { Table, Form, Tooltip, Image } from "antd";
import { EditableCell } from "../EditableCell";
import type { TableRow, FoodTableProps } from "@/types";
import { useState } from "react";
import { allergyIcons } from "../../utils/createEvent.utils"

export default function FoodTable({
  tableData,
  setTableData,
  unit,
  selectedRowKeys,
  setSelectedRowKeys,
}: FoodTableProps) {
  const [form] = Form.useForm(); //get form state
  const [editingKey, setEditingKey] = useState<React.Key>(""); // get editing key
  const isEditing = (record: TableRow) => record.key === editingKey; //function to find the cell that is being edited


  //editing function to set the current row selected to the editing row
  const edit = (record: TableRow) => {
    form.setFieldsValue({...record });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey(""); //remove any previous editing key, for the cancel button on each row

  //function to save the edited row after pressing "save"
  const save = async (key: React.Key) => {
    try {
      const row = await form.validateFields(); //get row
      if (row.quantity <= 0) return; //don't let it save with a negative quantity
      const newData = [...tableData]; //get new data
      const index = newData.findIndex((item) => item.key === key); //find index of edited row
      //if row is valid, get the new row, 
      if (index > -1) {
        const item = newData[index]; //original row
        newData.splice(index, 1, { ...item, ...row }); //puts the new row in
        setTableData(newData); //sets the new row in the table
        setEditingKey(""); //resets editing key
      }
    } catch (err) {
      console.log("Validation error", err); //catches error
    }
  };

  //columns, hardcoded for the table
  const columns = [
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      editable: true,
    },
    {
      title: "Name",
      dataIndex: "food",
      key: "food",
      render: (name: string) => (
        <div>{name[0].toUpperCase() + name.substring(1).toLowerCase()}</div>
      ),
    },
    {
      title: "Calories",
      dataIndex: "calories",
      key: "calories",
      render: (cal: number) => <div>{Math.round(cal)} kcal</div>,
    },
    {
      title: "Protein",
      dataIndex: "proteins",
      key: "proteins",
      render: (val: number) => (
        <div>
          {Math.round(val)} {unit}
        </div>
      ),
    },
    {
      title: "Carbs",
      dataIndex: "carbs",
      key: "carbs",
      render: (val: number) => (
        <div>
          {Math.round(val)} {unit}
        </div>
      ),
    },
    {
      title: "Fat",
      dataIndex: "fats",
      key: "fats",
      render: (val: number) => (
        <div>
          {Math.round(val)} {unit}
        </div>
      ),
    },
    {
      title: "Allergies",
      dataIndex: "allergies",
      key: "allergies",
      render: (allergy: string[]) => //mapping to map all allergies into the respective table cell
        (allergy === undefined || allergy.length === 0) ? (
          <div style={{ textAlign: "center" }}>N/A</div>
        ) : (
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
          >
            {allergy.map((item, index) => (
              <Tooltip key={index} title={`${item} allergy`}>
                <Image
                  width={16}
                  height={16}
                  style={{ position: "relative", bottom: "4px" }}
                  src={allergyIcons[item]}
                  alt={item}
                />
              </Tooltip>
            ))}
          </div>
        ),
    },
    {
      //This is our editing table logic, gives us cancel and editing logic in line when we click action
      title: "Action",
      dataIndex: "operation",
      render: (_: unknown, record: TableRow) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a onClick={cancel}>Cancel</a>
          </>
        ) : (
          <a aria-disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </a>
        );
      },
    },
  ];
  //mergeed Columns are used when we press action so we can edit the quantity inLine
  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: col.editable
      ? (record: TableRow) => ({
          record,
          inputType: "number",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          onPressEnter: () => save(record.key),
        })
      : undefined,
  }));

  return (
    <Form form={form} component={false}>
      <Table
        dataSource={tableData}
        columns={mergedColumns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{ pageSize: 5 }}
        components={{
          body: {
            cell: (props) => <EditableCell {...props} form={form} />,
          },
        }}
      />
    </Form>
  );
}
