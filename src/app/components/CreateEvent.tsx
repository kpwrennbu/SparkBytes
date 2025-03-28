"use client";
import { useState } from "react";
import { Modal, Button, Form, Space, Input, Select, DatePicker, TimePicker, Flex, Image, Table } from "antd";
import dayjs from 'dayjs';
import { PlusCircleOutlined } from '@ant-design/icons';
import SearchFood from "./SearchFood";
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
  const format = 'HH:mm a';
  const data = [
        { 
        key: 1,
        food: "BLT",
        quantity: 2,
        calories: 540,
        protein: 15,
        fat: 20,
        carbs: 5,
        allergies: ["Gluten", "Tree Nut"]
      }, 
      {
        key: 2, 
        food: "Fortnite Sandwich",
        quantity: 5,
        calories: 540,
        protein: 15,
        fat: 20,
        carbs: 5,
        allergies: ["Gluten", "Tree Nut"]
      }  
      ]
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
                  <Image width={16} height={16} src={allergies[item]} alt={item} />
                </div>
              ))}
            </div>
          )
              }
      ]
  const allergies: Record<string, string> = {
    "Dairy": "/allergyIcons/dairy-free.png",
    "Egg": "/allergyIcons/egg-free.png",
    "Fish": "/allergyIcons/fish-free.png",
    "Gluten": "/allergyIcons/gluten-free.png", 
    "Peanut": "/allergyIcons/peanut-free.png",
    "Seafood": "/allergyIcons/seafood-free.png",
    "Soy": "/allergyIcons/soy-free.png",
    "Tree Nut": "/allergyIcons/treeNut-free.png"
  }
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

    <Flex justify="space-between" align="center">
        <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
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
            <SearchFood setIsTableVisible={setIsTableVisible}/> 
        </Form.Item>
      <Form.Item {...tailLayout}>
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
    <Table dataSource={data} columns={columms}> 

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
