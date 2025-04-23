// ManuallyInputFood.tsx
"use client";
import React, { useState } from "react";
import { Form, Input, InputNumber, Select, Button, Typography } from "antd";
import { ManuallyInputFoodProps, ManuallyInputFormValues } from "@/types";

const { Option } = Select;

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

export default function ManuallyInputFood({
  tableData,
  addInputtedToEventsTable,
}: ManuallyInputFoodProps) {
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  const onFinish = (values: ManuallyInputFormValues) => {
    if (tableData?.some(data => data["food"].toLowerCase() === values.food.toLowerCase())) {
      setError("Error! Food already in table. Please adjust the quantity there.");
      return;
    }

    setError("");
    const newData = {
      key: Date.now() + Math.random(),
      ...values,
    };
    addInputtedToEventsTable(newData);
    form.resetFields();
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      maxWidth: "400px",
      width: "100%",
      padding: "16px 24px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}>
      <Typography.Title level={4} style={{ textAlign: "center", marginBottom: 0 }}>
        Manual Food Input
      </Typography.Title>

      {error && (
        <div style={{ padding: "12px", background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: "8px" }}>
          <Typography.Text type="danger">{error}</Typography.Text>
          <div style={{ marginTop: "8px" }}>
            <Button onClick={() => { form.resetFields(); setError(""); }}>Clear Form</Button>
          </div>
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="food" label="Food Name" rules={[{ required: true }]}> <Input /> </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}> <InputNumber min={0} style={{ width: "100%" }} /> </Form.Item>
        <Form.Item name="calories" label="Calories" rules={[{ required: true }]}> <InputNumber min={0} style={{ width: "100%" }} /> </Form.Item>
        <Form.Item name="carbs" label="Carbs (g)" rules={[{ required: true }]}> <InputNumber min={0} style={{ width: "100%" }} /> </Form.Item>
        <Form.Item name="proteins" label="Proteins (g)" rules={[{ required: true }]}> <InputNumber min={0} style={{ width: "100%" }} /> </Form.Item>
        <Form.Item name="fats" label="Fats (g)" rules={[{ required: true }]}> <InputNumber min={0} style={{ width: "100%" }} /> </Form.Item>
        <Form.Item name="allergies" label="Allergies" rules={[{ required: true }]}> <Select mode="multiple" placeholder="Select allergies"> {allergiesOptions.map((allergy) => (<Option key={allergy} value={allergy}>{allergy}</Option>))} </Select> </Form.Item>
        <Form.Item name="servingSizeUnit" label="Serving Size" rules={[{ required: true }]}> <Select><Option value="g">g</Option></Select> </Form.Item>
        <Form.Item style={{ marginTop: "24px" }}> <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}>Submit Food Item</Button> </Form.Item>
      </Form>
    </div>
  );
}