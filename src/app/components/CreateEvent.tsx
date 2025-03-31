"use client";
import { useState } from "react";
import { Modal, Button, Form, Space, Input, Select, DatePicker, TimePicker, Flex, Image, Table, Typography } from "antd";
import dayjs from 'dayjs';
import { PlusCircleOutlined } from '@ant-design/icons';
import SearchFood from "./SearchFood";
const { Option } = Select;
type TableRow = {
    key: number;
    food: string;
    quantity: number;
    serving_size: string;
    proteins: number;
    fats: number;
    carbs: number;
    allergies: string[];
  };
  
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
  const [foods, setFoods] = useState<any[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const format = 'HH:mm a';
   
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
  const onFinish = values => {
    console.log(values);
  };
  const onReset = () => {
    form.resetFields();
  };
  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };
  const addFoodToEventsTable = () => { 
    const newData: TableRow = { 
        key: tableData.length + 1, // or use a UUID if preferred
        food: foods[0]["description"],
        quantity: 1,
        serving_size: foods[0]["servingSize"] + foods[0]["servingSizeUnit"],
        proteins: foods[0]["proteinPerServing"],
        fats: foods[0]["fatsPerServing"],
        carbs: foods[0]["carbsPerServing"], 
        allergies: foods[0]["allergens"],
      };
      
    setTableData([...tableData, newData])
    setFoods([])
  }
  const addToFoodDB = async () => { 
    // Insert into Food table
    const { data: foodData, error: foodError } = await supabase
      .from('Food')
      .insert([
        {
          name: foods[0]["description"],
          serving_size: foods[0]["servingSize"] + foods[0]["servingSizeUnit"],
          carbs: foods[0]["carbsPerServing"],
          proteins: foods[0]["proteinPerServing"],
          fats: foods[0]["fatsPerServing"],
          allergies: foods[0]["allergens"],
          quantity: 1
        }
      ])
      .select(); // ensure it returns the inserted rows (incl. IDs)
  
    if (foodError) {
      console.error('Insert error (Food):', foodError);
      return;
    } else {
      console.log('Inserted food data:', foodData);
    }
  
    // Assuming the 'id' of the inserted food is needed for EventsFood
    const foodId = foodData[0]?.id;
  
    if (foodId) {
      const { data: eventsFoodData, error: eventsFoodError } = await supabase
        .from('EventsFood')
        .insert([
          {
            event_id: 1, // replace with actual event ID
            food_id: foodId
          }
        ]);
  
      if (eventsFoodError) {
        console.error('Insert error (EventsFood):', eventsFoodError);
      } else {
        console.log('Inserted into EventsFood:', eventsFoodData);
      }
    }
    setIsTableVisible(true);
    setFoods([]);
  }
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
          <Option value="male">Warren Towers</Option>
          <Option value="female">Center for Computer and Data Science</Option>
          <Option value="other">George Sherman Union</Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
      >
        {({ getFieldValue }) =>
          getFieldValue('gender') === 'other' ? (
            <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item>
      <Form.Item label="RangePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="TimePicker">
         <TimePicker.RangePicker use12Hours format={format} />     
        </Form.Item>
        <Form.Item label="Food Picker">
            <SearchFood setIsTableVisible={setIsTableVisible} foods={foods} setFoods={setFoods}/> 
        </Form.Item>
      <Form.Item {...tailLayout}>
      {foods && ( 
         <div> 
         <Button onClick={addFoodToEventsTable}> 
             Add Food to Event
         </Button>
       </div>
      )}
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Space>
      </Form.Item>
    </Form>
    <Table dataSource={tableData} columns={columms} style={{alignSelf: "flex-start"}}> 

    </Table>
    </Flex>
      </Modal>
    </>
  );
}


// const cardStyles = { //had to put it in these cus for some reason the styling wouldn't work
//   borderRadius: "10px",
//   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//   width: "25%",
//   padding: "0.5em"
// };
// // const buttonStyle = { 
// //   width: "25px"
// // }
// const timeStyle = {
//   fontWeight: "bold",
//   color: "#555",
// };
