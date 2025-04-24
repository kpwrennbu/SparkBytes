// CreateEvent.tsx
"use client";
import { useState } from "react";
import {
  Modal, Button, Input, Select, DatePicker, TimePicker, Flex, Typography, Form, Table, Switch, Tooltip, Image
} from "antd";
import type { TableRowSelection } from 'antd/es/table/interface';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Food, TableRow } from "@/types";
import SearchFood from "./SearchFood";
import supabase from "../api/supabaseClient";
import { EditableCell } from "./EditableCell";
import ManuallyInputFood from "./ManuallyInputFood";

const { Option } = Select;
const format = 'HH:mm a';

const all: Record<string, string> = {
  "dairy": "/allergyIcons/dairy-free.png",
  "egg": "/allergyIcons/egg-free.png",
  "fish": "/allergyIcons/fish-free.png",
  "gluten": "/allergyIcons/gluten-free.png",
  "peanut": "/allergyIcons/peanut-free.png",
  "seafood": "/allergyIcons/seafood-free.png",
  "soy": "/allergyIcons/soy-free.png",
  "tree Nut": "/allergyIcons/treeNut-free.png"
};

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
  const [isChecked, setIsChecked] = useState(false);
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [finalEventError, setFinalEventError] = useState("");
  const handleSwitchChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const addInputtedToEventsTable = (newData: TableRow) => {
    setTableData(tableData => [...tableData, newData])
  }

  const addFoodToEventsTable = (food: Food) => {
    if (quantity <= 0) {
      setQuantityError(true);
      return;
    }
    setQuantityError(false);

    const newData: TableRow = {
      key: Date.now() + Math.random(),
      food: food.description,
      quantity: quantity,
      servingSizeUnit: food.servingSizeUnit,
      calories: food.caloriesPerServing,
      proteins: food.proteinPerServing,
      fats: food.fatPerServing,
      carbs: food.carbsPerServing,
      allergies: food.allergens,
    };
    setTableData(tableData => [...tableData, newData]);
    setIsTableVisible(true);
    if (unit !== 'g') setUnit(food.servingSizeUnit);
    setFoods([]);
    setQuantity(1);
  };

  const deleteRowsFromFoodTable = () => {
    const updated = tableData.filter(row => !selectedRowKeys.includes(row.key));
    setTableData(updated);
    setSelectedRowKeys([]);
  };

  const addEventToDB = async () => {
    console.log("tableData: ", tableData)
   
    if (!eventDate || !timeRange || !location || !eventName || tableData.length === 0) {
      setFinalEventError("Error. Please make sure you have entered food and credentials");
      return;
    }    
    const [startTime, endTime] = timeRange;
    const time_start = eventDate.clone().hour(startTime.hour()).minute(startTime.minute()).second(0).format();
    const time_end = eventDate.clone().hour(endTime.hour()).minute(endTime.minute()).second(0).format();

    const { data, error } = await supabase.from('Events').insert([{ name: eventName, location, time_start, time_end, creator_id: 1 }]).select();
    if (error) return;
    const eventId = data?.[0]?.id;

    for (const row of tableData) {
      await supabase.from('Food').insert([{
        event_id: eventId,
        total_quantity: row.quantity,
        quantity_left: row.quantity,
        name: row.food.charAt(0).toUpperCase() + row.food.slice(1).toLowerCase(),
        calories: Math.round(row.calories),
        carbs: Math.round(row.carbs),
        proteins: Math.round(row.proteins),
        fats: Math.round(row.fats),
        allergies: row.allergies,
        serving_size_unit: unit,
      }]);
    }
    setIsModalVisible(false);
    // Fetch all users from Supabase
const { data: users, error: usersError } = await supabase
.from('Users') // make sure your user profile table is actually called 'Users'
.select('email');

if (usersError) {
console.error("❌ Failed to fetch user emails:", usersError.message);
return;
}

const foodList = tableData
  .map((item) => `🍴 ${item.food[0].toUpperCase() + item.food.slice(1).toLowerCase()}`)
  .join("\n");

const message = `
🎉 A new event just dropped!

📍 *${eventName}*  
🗺️ Location: ${location === "cds" ? "Center for Computing and Data Sciences" : location === "gsu" ? "George Sherman Union" : "Warren Towers"}  
🕒 Time: ${new Date(time_start).toLocaleString()} - ${new Date(time_end).toLocaleString()}

Here's what’s on the menu:

${foodList}

Tap into the app to grab your favorites before they’re gone! 😋
`;


// Send emails to all users
for (const user of users) {
if (user.email.endsWith('@bu.edu')) {
  await fetch("/api/sendEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: user.email,
      subject: `New Event: ${eventName}`,
      text: message,
    }),
  });
}
}

  };

  const isEditing = (record: any) => record.key === editingKey;
  const edit = (record: any) => {
    tableForm.setFieldsValue({ quantity: '', ...record });
    setEditingKey(record.key);
  };
  const cancel = () => setEditingKey('');
  const save = async (key: React.Key) => {
    const row = await tableForm.validateFields();
    if (row.quantity <= 0) return;
    const newData = [...tableData];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setTableData(newData);
      setEditingKey('');
    }
  };

  const rowSelection: TableRowSelection<TableRow> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  };

  const columns = [
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', editable: true },
    {
      title: 'Name',
      dataIndex: 'food',
      key: 'food',
      render: (name: string) => <div>{name[0].toUpperCase() + name.substring(1).toLowerCase()}</div>
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      render: (cal: number) => <div>{Math.round(cal)} kcal</div>
    },
    {
      title: 'Protein',
      dataIndex: 'proteins',
      key: 'proteins',
      render: (val: number) => <div>{Math.round(val) + unit}</div>
    },
    {
      title: 'Carbs',
      dataIndex: 'carbs',
      key: 'carbs',
      render: (val: number) => <div>{Math.round(val) + unit}</div>
    },
    {
      title: 'Fat',
      dataIndex: 'fats',
      key: 'fats',
      render: (val: number) => <div>{Math.round(val) + unit}</div>
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
              <Tooltip key={index} title={`${item} allergy`}>
                <Image width={16} height={16} style={{ position: "relative", bottom: "4px" }} src={all[item]} alt={item} />
              </Tooltip>
            ))}
          </div>
        )
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

  const mergedColumns = columns.map(col => ({
    ...col,
    onCell: col.editable
      ? (record: TableRow) => ({ record, inputType: 'number', dataIndex: col.dataIndex, title: col.title, editing: isEditing(record), onPressEnter: () => save(record.key) })
      : undefined,
  }));

  return (
    <>
      <Button icon={<PlusCircleOutlined />} onClick={() => setIsModalVisible(true)} />
      <Modal open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} width="90vw" style={{ top: 20 }}>
        <Typography.Title level={2} style={{ textAlign: "center" }}>Create an Event</Typography.Title>
        <Flex justify="center" align="flex-start" wrap="wrap" gap="48px">
          <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "16px", marginTop: "50px"}}>
          <Typography.Title level={4}>Add Credentials</Typography.Title>
          <Input placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <Select placeholder="Select a location" value={location || "Select a location"} onChange={setLocation} allowClear>
              <Option value="warren">Warren Towers</Option>
              <Option value="cds">Center for Computer and Data Science</Option>
              <Option value="gsu">George Sherman Union</Option>
            </Select>
            <DatePicker value={eventDate} onChange={setEventDate} style={{ width: "100%" }} />
            <TimePicker.RangePicker use12Hours format={format} value={timeRange} onChange={setTimeRange} style={{ width: "100%" }} />
          </div>

          <div style={{ flexGrow: 1, minWidth: "500px" }}>
            <Typography.Title level={4}>Current Food Items</Typography.Title>
            <Form form={tableForm} component={false}>
              <Table
                dataSource={tableData}
                columns={mergedColumns}
                rowSelection={rowSelection}
                pagination={{ current: currentPage, pageSize: 5, onChange: page => { setCurrentPage(page); cancel(); } }}
                components={{ body: { cell: (props) => <EditableCell {...props} form={tableForm} /> } }}
              />
            </Form>
          </div>
        </Flex>

        <div style={{ marginTop: "2rem" }}>
          <Flex align="center" justify="center" gap="1em">
            <Typography.Title level={4} style={{ textAlign: "center", margin: 0 }}>Add Food Item</Typography.Title>
            <Switch checked={isChecked} onChange={handleSwitchChange} style={{ backgroundColor: isChecked ? "#52c41a" : undefined }} />
          </Flex>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
            {isChecked ? (
              <ManuallyInputFood
                tableData={tableData}
                addInputtedToEventsTable={addInputtedToEventsTable}
              />
            ) : (
              <SearchFood
                isTableVisible={isTableVisible}
                setIsTableVisible={setIsTableVisible}
                foods={foods}
                setFoods={setFoods}
                quantity={quantity}
                setQuantity={setQuantity}
                addFoodToEventsTable={addFoodToEventsTable}
                tableData={tableData}
              />
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", marginTop: "32px", gap: "2em"}}>
          <Button type="primary" size="large" style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }} onClick={addEventToDB}>
            Add Event
          </Button>
          {finalEventError && <Typography.Text type="danger">{finalEventError}</Typography.Text>}
        </div>
        <div>
        </div>
      </Modal>
    </>
  );
}