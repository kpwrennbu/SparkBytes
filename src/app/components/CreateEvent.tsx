"use client";
import { useState } from "react";
import { Modal, Button, Form, Input, Select, DatePicker, TimePicker, Flex, Image, Table, Typography } from "antd";
import type { TableRowSelection } from 'antd/es/table/interface';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Food, TableRow, FormValues } from "@/types";
import SearchFood from "./SearchFood";
import supabase from "../api/supabaseClient";
const { Option } = Select;

  
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
export default function CreateEvent() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const format = 'HH:mm a';
   
  const all: Record<string, string> = {
    "Dairy": "/allergyIcons/dairy-free.png",
    "Egg": "/allergyIcons/egg-free.png",
    "Fish": "/allergyIcons/fish-free.png",
    "Gluten": "/allergyIcons/gluten-free.png", 
    "Peanut": "/allergyIcons/peanut-free.png",
    "Seafood": "/allergyIcons/seafood-free.png",
    "Soy": "/allergyIcons/soy-free.png",
    "Tree Nut": "/allergyIcons/treeNut-free.png"
  }
    const columms = [ 
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Name',
          dataIndex: 'food',
          key: 'food',
        },
        {
          title: 'Calories',
          dataIndex: 'calories',
          key: 'calories',
        },
        {
          title: 'Protein',
          dataIndex: 'protein',
          key: 'protein',
        },
        {
          title: 'Carbs',
          dataIndex: 'carbs',
          key: 'carbs',
        },
        {
          title: 'Fat',
          dataIndex: 'fat',
          key: 'fat',
        },
        {
          title: 'Allergies',
          dataIndex: 'allergies',
          key: 'allergies',
          render: (allergy: string[]) => (
            <div style={{ display: "flex", width: "100%", gap: "8px", alignItems: "center" }}>
              {allergy.map((item, index) => (
                <div key={index}>
                  <Image width={16} height={16} src={all[item]} alt={item} />
                </div>
              ))}
            </div>
          )
              }
      ]

const [form] = Form.useForm();
//   const onGenderChange = value => {
//     switch (value) {
//       case 'male':
//         form.setFieldsValue({ note: 'Hi, man!' });
//         break;
//       case 'female':
//         form.setFieldsValue({ note: 'Hi, lady!' });
//         break;
//       case 'other':
//         form.setFieldsValue({ note: 'Hi there!' });
//         break;
//       default:
//     }
//   };
  const onFinish = (values: FormValues) => {
    console.log(values);
  };
  // const onReset = () => {
  //   form.resetFields();
  // };
  // const onFill = () => {
  //   form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  // };
  const deleteRowsFromFoodTable = () => { 
    const selectedRows = tableData.filter(row => !selectedRowKeys.includes(row.key));
    setTableData(selectedRows)
    setSelectedRowKeys([]);
  }
  const addFoodToEventsTable = () => { 
    console.log(quantity);
    if (quantity === 0) { 
      setQuantityError(true);
      return;
    }
    else { 
      setQuantityError(false);
    }
    const newData: TableRow = { 
        key: tableData.length + 1, // or use a UUID if preferred
        food: foods[0]["description"],
        quantity: quantity,
        serving_size: foods[0]["servingSize"] + foods[0]["servingSizeUnit"],
        proteins: foods[0]["proteinPerServing"],
        fats: foods[0]["fatPerServing"],
        carbs: foods[0]["carbsPerServing"], 
        allergies: foods[0]["allergens"],
      };
    // addToFoodDB(); // prob shouldnt be here
    setTableData([...tableData, newData])
    setIsTableVisible(true);
    setFoods([])
    setQuantity(1);
  }
  // const addToFoodDB = async () => { 
  //   // Insert into Food table
  //   const { data: foodData, error: foodError } = await supabase
  //     .from('Food')
  //     .insert([
  //       {
  //         name: foods[0]["description"],
  //         serving_size: foods[0]["servingSize"] + foods[0]["servingSizeUnit"],
  //         carbs: foods[0]["carbsPerServing"],
  //         proteins: foods[0]["proteinPerServing"],
  //         fats: foods[0]["fatPerServing"],
  //         allergies: foods[0]["allergens"],
  //         quantity: 1
  //       }
  //     ])
  //     .select(); // ensure it returns the inserted rows (incl. IDs)
  
  //   if (foodError) {
  //     console.error('Insert error (Food):', foodError);
  //     return;
  //   } else {
  //     console.log('Inserted food data:', foodData);
  //   }
  
  //   // Assuming the 'id' of the inserted food is needed for EventsFood
  //   const foodId = foodData[0]?.id;
  
  //   if (foodId) {
  //     const { data: eventsFoodData, error: eventsFoodError } = await supabase
  //       .from('EventsFood')
  //       .insert([
  //         {
  //           event_id: 1, // replace with actual event ID
  //           food_id: foodId
  //         }
  //       ]);
  
  //     if (eventsFoodError) {
  //       console.error('Insert error (EventsFood):', eventsFoodError);
  //     } else {
  //       console.log('Inserted into EventsFood:', eventsFoodData);
  //     }
  //   }
  //   setIsTableVisible(true);
  //   setFoods([]);
  // }

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

const rowSelection: TableRowSelection<TableRow> = {
  selectedRowKeys,
  onChange: (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  },
};
  const addEventToDB = async () => {
    const values = form.getFieldsValue();
  
    const date = values.eventDate; // Moment object
    const [startTime, endTime] = values.timeRange; // Moment objects
  
    // Combine date with start and end times
    const time_start = date
      .clone()
      .hour(startTime.hour())
      .minute(startTime.minute())
      .second(0)
      .toISOString();
  
    const time_end = date
      .clone()
      .hour(endTime.hour())
      .minute(endTime.minute())
      .second(0)
      .toISOString();
  
    const { data, error } = await supabase
      .from('Events')
      .insert([
        {
          name: values.eventName,
          location: values.location,
          time_start: time_start,
          time_end: time_end,
          creator_id: 1
        }
      ]);
  
    if (error) {
      console.error('Insert error (Events):', error);
    } else {
      console.log('Inserted event:', data);
    }
  };
  
  
  return (
    <>
    <Button icon={<PlusCircleOutlined />} onClick={() => setIsModalVisible(true)} />
    
    
    <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="100vw"
        style={{ top: 0, padding: 0 }}
        styles={{
          body: { height: "100vh", margin: 0, padding: 0 },
        }}
      >
    <Typography.Text>Create an Event </Typography.Text>
    <Flex justify="space-between" align="center" style={{padding: "2em"}} gap="2em">
        <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}

    >
      <Form.Item name="eventName" label="Event Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="location" label="Location" rules={[{ required: true }]}>
        <Select
          placeholder="Select a option and change input text above"
          allowClear
        >
          <Option value="warren">Warren Towers</Option>
          <Option value="cds">Center for Computer and Data Science</Option>
          <Option value="gsu">George Sherman Union</Option>
        </Select>
      </Form.Item>
      <Form.Item name="eventDate" label="Date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="timeRange" label="Time Range" rules={[{ required: true }]}>
         <TimePicker.RangePicker use12Hours format={format} />     
        </Form.Item>
        <Form.Item label="Food Picker">
            <SearchFood isTableVisible={isTableVisible} setIsTableVisible={setIsTableVisible} foods={foods} setFoods={setFoods} quantity={quantity} setQuantity={setQuantity} addFoodToEventsTable={addFoodToEventsTable}/> 
        </Form.Item>
      <Form.Item {...tailLayout}>
      {foods && ( 
         <div> 
         {quantityError && ( 
            <Typography.Text type="danger">Error: Quantity cannot be zero or null</Typography.Text>
         )}
       </div>
      )}
        {/* <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Space> */}
      </Form.Item>
    </Form>
    <div>
      <Table dataSource={tableData} columns={columms} style={{alignSelf: "flex-start"}} 
          pagination={{
            current: currentPage,
            pageSize: 5,
            onChange: (page) => {
              setCurrentPage(page); 
            },
          }}
          rowSelection={rowSelection}

      > 
      </Table>
      {(selectedRowKeys.length !== 0)  && <Button onClick={deleteRowsFromFoodTable}>Delete Selected Rows</Button> }

    </div>
    </Flex>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center"
        }}>
          <Button onClick={addEventToDB}>Add Event</Button>
        </div>
      </Modal>
    </>
  );
}
