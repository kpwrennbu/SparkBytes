"use client";
import React, {useState} from "react";
import { Form, Input, InputNumber, Select, Button, Typography } from "antd";
import { ManuallyInputFoodProps, ManuallyInputFormValues } from "@/types";

const { Option } = Select;

//These are the allergy options for the dropdown menu
const allergiesOptions = [
  "dairy",
  "egg",
  "gluten",
  "fish",
  "peanut",
  "seafood",
  "soy",
  "tree Nut",
];

export default function ManuallyInputFood({tableData, setTableData}: ManuallyInputFoodProps) {
  const [form] = Form.useForm(); //get form state
  const [error, setError] = useState("") //error if user makes any mistakes putting in food
  const onFinish = (values : ManuallyInputFormValues) => {
    //check to make sure the user doesn't double input the same item
    if (tableData?.some(data => data["food"].toLowerCase() === values.food.toLowerCase())) { 
      setError("Error! Food already in table. Please adjust the quantity there.");
      console.log("Error! Already in table")
      return;
    }
    else { 
      setError("");
    }
    //make new data row for the table
    const newData = { 
      key: Date.now() + Math.random(),
      ...values
    }
    // console.log("new Data = ", newData)
    setTableData(tableData => [...tableData, newData]); //put it in the table
    form.resetFields(); //reset the fields
  };

  return (
    <>
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ width: "30%" }} >
      <Form.Item name="food" label="Food Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="calories" label="Calories" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="carbs" label="Carbs (g)" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="proteins" label="Proteins (g)" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="fats" label="Fats (g)" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="allergies"
        label="Allergies"
      >
        <Select mode="multiple" placeholder="Select allergies">
          {allergiesOptions.map((allergy) => (
            <Option key={allergy} value={allergy}>
              {allergy}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="servingSizeUnit" label="Serving Size" rules={[{ required: true }]}>
        <Select>
          <Option value="g">g</Option>
        </Select>
      </Form.Item>

      <Form.Item style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Button type="primary" htmlType="submit" style={{background: "#52c41a" }}>
          Submit Food Item
        </Button>
      </Form.Item>

      {error && 
         <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px"
         }}>
      <Typography.Text type="danger">{error}</Typography.Text>
      <Button onClick={() => {
        form.resetFields(); //reset fields
        setError(""); //reset error
        }}>Clear Form</Button>
        </div>
      }
    </Form>
    
   
    </>
  );
};