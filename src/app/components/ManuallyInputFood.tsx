"use client";
import React, {useState} from "react";
import { Form, Input, InputNumber, Select, Button, Typography } from "antd";
import { ManuallyInputFoodProps, ManuallyInputFormValues } from "@/types";

const { Option } = Select;

const allergiesOptions = [
  "Dairy",
  "Egg",
  "Gluten",
  "Fish",
  "Peanut",
  "Seafood",
  "Soy",
  "Tree Nut",
];

export default function ManuallyInputFood({tableData, addInputtedToEventsTable}: ManuallyInputFoodProps) {
  const [form] = Form.useForm();
  const [error, setError] = useState("")
  const onFinish = (values : ManuallyInputFormValues) => {
    if (tableData?.some(data => data["food"].toLowerCase() === values.food.toLowerCase())) { 
      setError("Error! Food already in table. Please adjust the quantity there.");
      console.log("Error! Already in table")
      return;
    }
    else { 
      setError("");
     console.log("In the else");
    }
    console.log("Form values:", values);
    const newData = { 
      key: Date.now() + Math.random(),
      ...values
    }
    console.log("new Data = ", newData)
    addInputtedToEventsTable(newData);
    form.resetFields();
  };

  return (
    <>
    {error && 
    <> 
    <Typography.Text type="danger">{error}</Typography.Text>
    <Button onClick={() => {
      form.resetFields();
      setError("");
      }}>Clear Form</Button>
    </>
    }
    <Form form={form} layout="vertical" onFinish={onFinish}>
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
        rules={[{ required: true, message: "Please select at least one allergy" }]}
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Food Item
        </Button>
      </Form.Item>
    </Form>
    </>
  );
};