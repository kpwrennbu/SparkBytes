"use client";
import { useState, useEffect } from "react";
import { Card, Modal, Flex, Table, Button, Tooltip } from "antd";
import Image from "next/image";
import { EventRow, TableRow } from "@/types";
import supabase from "../api/supabaseClient";

export default function FoodCard({ id, name, location, time_start, time_end, creator_id }: EventRow) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [food, setFood] = useState<TableRow[]>([]);
  const [unit, setUnit] = useState("g");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const onReservation = async () => {
    const selectedRows = food.filter(row => selectedRowKeys.includes(row.id));

    for (const row of selectedRows) {
      const newQuantityLeft = row.quantity_left - 1;

      const { error: orderError } = await supabase
        .from("Orders")
        .insert([
          {
            event_id: id,
            student_id: 1,
            food_id: row.id,
          },
        ]);

      if (orderError) {
        console.error(`Error creating order for food id ${row.id}:`, orderError);
        continue;
      }

      const { error } = await supabase
        .from("Food")
        .update({ quantity_left: newQuantityLeft })
        .eq("id", row.id);

      if (error) {
        console.error(`Error updating quantity_left for food id ${row.id}:`, error);
      }
    }

    await fetchFoods();
    setSelectedRowKeys([]);
  };

  const allergies: Record<string, string> = {
    dairy: "/allergyIcons/dairy-free.png",
    egg: "/allergyIcons/egg-free.png",
    fish: "/allergyIcons/fish-free.png",
    gluten: "/allergyIcons/gluten-free.png",
    peanut: "/allergyIcons/peanut-free.png",
    seafood: "/allergyIcons/seafood-free.png",
    soy: "/allergyIcons/soy-free.png",
    "tree Nut": "/allergyIcons/treeNut-free.png",
  };

  const imgs: Record<string, string> = {
    cds: "/CDS.jpg",
    warren: "/WarrenTowers.jpg",
    gsu: "/GSU.jpg",
  };

  const columns = [
    {
      title: "Quantity",
      dataIndex: "quantity_left",
      key: "quantity_left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <div>{name[0].toUpperCase() + name.substring(1).toLowerCase()}</div>,
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
      render: (val: number) => <div>{Math.round(val) + unit}</div>,
    },
    {
      title: "Carbs",
      dataIndex: "carbs",
      key: "carbs",
      render: (val: number) => <div>{Math.round(val) + unit}</div>,
    },
    {
      title: "Fat",
      dataIndex: "fats",
      key: "fats",
      render: (val: number) => <div>{Math.round(val) + unit}</div>,
    },
    {
      title: "Allergies",
      dataIndex: "allergies",
      key: "allergies",
      render: (allergy: string[]) =>
        allergy.length === 0 ? (
          <div style={{ textAlign: "center" }}>N/A</div>
        ) : (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {allergy.map((item, index) => (
              <Tooltip key={index} title={`${item} allergy`}>
                <Image width={16} height={16} style={{ position: "relative", bottom: "4px" }} src={allergies[item]} alt={item} />
              </Tooltip>
            ))}
          </div>
        ),
    },
  ];

  const fetchFoods = async () => {
    const { data, error } = await supabase
      .from("Food")
      .select("*")
      .eq("event_id", id)
      .gt("quantity_left", 0);

    if (error) {
      console.error("Error fetching food:", error.message);
    } else {
      setFood(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchFoods();
    }
  }, [id]);

  const formatTimeRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const sameDay = startDate.toDateString() === endDate.toDateString();

    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
    };

    const formattedDate = startDate.toLocaleDateString(undefined, dateOptions);
    const startTime = startDate.toLocaleTimeString(undefined, timeOptions);
    const endTime = endDate.toLocaleTimeString(undefined, timeOptions);

    return sameDay
      ? `${formattedDate}, ${startTime} - ${endTime}`
      : `${formattedDate} ${startTime} - ${endDate.toLocaleDateString(undefined, dateOptions)} ${endTime}`;
  };

  return (
    <>
      <Card
        hoverable
        style={cardStyles}
        onClick={() => setIsModalVisible(true)}
        cover={
          <div style={{ width: "100%", height: "200px", position: "relative" }}>
            <Image
              src={imgs[location]}
              alt={location}
              fill
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
          </div>
        }
      >
        <h3 style={{ marginBottom: "5px", fontWeight: "bold" }}>{location}</h3>
        <p style={{ color: "#666", marginBottom: "8px" }}>{name + "Need Description in form"}</p>
        <p style={timeStyle}>{formatTimeRange(time_start, time_end)}</p>
      </Card>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="100vw"
        style={{ top: 0, padding: 0 }}
        styles={{ body: { height: "100vh", margin: 0, padding: 0 } }}
      >
        <Card title={`${location} - Food Options`} style={{ height: "100%", width: "100%" }}>
          <Flex justify="start" align="flex-start">
            <div style={{ width: "30%", height: "500px", position: "relative" }}>
              <Image
                src={imgs[location]}
                alt={location}
                fill
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />
            </div>

            <div style={{ width: "70%", height: "500px", position: "relative" }}>
              <h1 style={{ textAlign: "center" }}>Food Available</h1>
              <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                {loading ? (
                  <p>loading...</p>
                ) : (
                  <>
                    <Table
                      dataSource={food}
                      columns={columns}
                      style={{ width: "75%" }}
                      rowKey="id"
                      rowSelection={rowSelection}
                    />
                    <div style={{ gap: "8px" }}>
                      <Button onClick={onReservation}>Reserve Item</Button>
                      <Button onClick={() => setSelectedRowKeys([])}>Clear All</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Flex>
        </Card>
      </Modal>
    </>
  );
}

const cardStyles = {
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "350px",
  padding: "0.5em",
};

const timeStyle = {
  fontWeight: "500",
  fontSize: "14px",
  color: "#444",
  marginTop: "10px",
};
