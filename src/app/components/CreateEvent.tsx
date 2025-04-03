"use client";
import { useState } from "react";
import {
  Modal, Button, Input, Select, DatePicker, TimePicker, Flex, Image, Table, Typography, Form
} from "antd";
import type { TableRowSelection } from 'antd/es/table/interface';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Food, TableRow } from "@/types";
import SearchFood from "./SearchFood";
import supabase from "../api/supabaseClient";
import { EditableCell } from "./EditableCell";

const { Option } = Select;
const format = 'HH:mm a';

export default function CreateEvent() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [unit, setUnit] = useState("");
  const [tableForm] = Form.useForm();

  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [timeRange, setTimeRange] = useState(null);

  const all: Record<string, string> = {
    "dairy": "/allergyIcons/dairy-free.png",
    "egg": "/allergyIcons/egg-free.png",
    "fish": "/allergyIcons/fish-free.png",
    "gluten": "/allergyIcons/gluten-free.png",
    "peanut": "/allergyIcons/peanut-free.png",
    "seafood": "/allergyIcons/seafood-free.png",
    "soy": "/allergyIcons/soy-free.png",
    "tree nut": "/allergyIcons/treeNut-free.png"
  };

  const addFoodToEventsTable = () => {
    if (quantity <= 0) {
      setQuantityError(true);
      return;
    }
    setQuantityError(false);

    const newData: TableRow = {
      key: tableData.length + 1,
      food: foods[0]["description"],
      quantity: quantity,
      servingSizeUnit: foods[0]["servingSizeUnit"],
      calories: foods[0]["caloriesPerServing"],
      proteins: foods[0]["proteinPerServing"],
      fats: foods[0]["fatPerServing"],
      carbs: foods[0]["carbsPerServing"],
      allergies: foods[0]["allergens"],
    };
    setTableData([...tableData, newData]);
    setIsTableVisible(true);
    setUnit(foods[0]["servingSizeUnit"]);
    setFoods([]);
    setQuantity(1);
  };

  const deleteRowsFromFoodTable = () => {
    const updated = tableData.filter(row => !selectedRowKeys.includes(row.key));
    setTableData(updated);
    setSelectedRowKeys([]);
  };

  const addEventToDB = async () => {
    if (!eventDate || !timeRange) {
      console.error("Missing date or time range.");
      return;
    }

    const [startTime, endTime] = timeRange;
    const time_start = eventDate.clone().hour(startTime.hour()).minute(startTime.minute()).second(0).toISOString();
    const time_end = eventDate.clone().hour(endTime.hour()).minute(endTime.minute()).second(0).toISOString();

    const { data, error } = await supabase
      .from('Events')
      .insert([
        {
          name: eventName,
          location,
          time_start,
          time_end,
          creator_id: 1,
        },
      ])
      .select();

    if (error) {
      console.error("Event insert error", error);
      return;
    }

    const eventId = data?.[0]?.id;

    for (const row of tableData) {
      const { error: rowError } = await supabase.from('Food').insert([
        {
          event_id: eventId,
          quantity: row.quantity,
          name: row.food,
          calories: row.calories,
          carbs: row.carbs,
          proteins: row.proteins,
          fats: row.fats,
          allergies: row.allergies,
          serving_size_unit: unit,
        },
      ]);

      if (rowError) {
        console.error('Insert error (Food):', rowError);
      }
      setIsModalVisible(false);
    }
  };

  const isEditing = (record: any) => record.key === editingKey;

  const edit = (record: any) => {
    tableForm.setFieldsValue({ quantity: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = await tableForm.validateFields();

      if (row.quantity <= 0) {
        setQuantityError(true);
        return;
      } else {
        setQuantityError(false);
      }

      const newData = [...tableData];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const rowSelection: TableRowSelection<TableRow> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  };

  const columns = [
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
    },
    {
      title: 'Name',
      dataIndex: 'food',
      key: 'food',
      render: (name: string) => <div>{name[0].toUpperCase() + name.substring(1).toLowerCase()}</div>,
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      render: (cal: number) => <div>{Math.round(cal)} kcal</div>,
    },
    {
      title: 'Protein',
      dataIndex: 'proteins',
      key: 'proteins',
      render: (val: number) => <div>{Math.round(val) + unit}</div>,
    },
    {
      title: 'Carbs',
      dataIndex: 'carbs',
      key: 'carbs',
      render: (val: number) => <div>{Math.round(val) + unit}</div>,
    },
    {
      title: 'Fat',
      dataIndex: 'fats',
      key: 'fats',
      render: (val: number) => <div>{Math.round(val) + unit}</div>,
    },
    {
      title: 'Allergies',
      dataIndex: 'allergies',
      key: 'allergies',
      render: (allergy: string[]) =>
        allergy.length === 0 ? (
          <div style={{ textAlign: "center" }}>N/A</div>
        ) : (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {allergy.map((item, index) => (
              <Image key={index} width={16} height={16} style={{ position: "relative", bottom: "4px" }} src={all[item]} alt={item} />
            ))}
          </div>
        ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>Save</a>
            <a onClick={cancel}>Cancel</a>
          </>
        ) : (
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>Edit</a>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: TableRow) => ({
        record,
        inputType: col.dataIndex === 'quantity' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onPressEnter: () => save(record.key),
      }),
    };
  });

  return (
    <>
      <Button icon={<PlusCircleOutlined />} onClick={() => setIsModalVisible(true)} />
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="100vw"
        style={{ top: 0 }}
        styles={{ body: { height: "100vh", padding: 0 } }}
      >
        <Typography.Text>Create an Event</Typography.Text>
        <Flex justify="space-between" align="center" style={{ padding: "2em" }} gap="2em">
          <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <Input placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <Select placeholder="Location" value={location} onChange={setLocation} allowClear>
              <Option value="warren">Warren Towers</Option>
              <Option value="cds">Center for Computer and Data Science</Option>
              <Option value="gsu">George Sherman Union</Option>
            </Select>
            <DatePicker value={eventDate} onChange={setEventDate} />
            <TimePicker.RangePicker use12Hours format={format} value={timeRange} onChange={(val) => setTimeRange(val)} />
            <SearchFood
              isTableVisible={isTableVisible}
              setIsTableVisible={setIsTableVisible}
              foods={foods}
              setFoods={setFoods}
              quantity={quantity}
              setQuantity={setQuantity}
              addFoodToEventsTable={addFoodToEventsTable}
            />
            {foods && quantityError && <Typography.Text type="danger">Please enter a quantity greater than 0</Typography.Text>}
            {selectedRowKeys.length !== 0 && (
              <Button danger onClick={deleteRowsFromFoodTable}>Delete Selected Rows</Button>
            )}
          </div>
          <Form form={tableForm} component={false}>
            <Table
              dataSource={tableData}
              columns={mergedColumns}
              style={{ alignSelf: "flex-start" }}
              components={{ body: { cell: (props) => <EditableCell {...props} form={tableForm} /> } }}
              pagination={{ current: currentPage, pageSize: 5, onChange: (page) => { setCurrentPage(page); cancel(); } }}
              rowSelection={rowSelection}
            />
          </Form>
        </Flex>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Button onClick={addEventToDB}>Add Event</Button>
        </div>
      </Modal>
    </>
  );
}
