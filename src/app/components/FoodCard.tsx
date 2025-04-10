"use client";
import { useState, useEffect } from "react";
import { Card, Modal, Flex, Table, Button, Tooltip} from "antd";
import Image from "next/image";
import { EventRow, TableRow } from "@/types";
import supabase from "../api/supabaseClient";
// interface FoodItem {
//   key: number;
//   food: string;
//   quantity: number;
//   calories: number;
//   protein: number;
//   fat: number;
//   carbs: number;
//   allergies: string[];
// }


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
  console.log("SelectedRowKeys: ", selectedRowKeys);
  const selectedRows = food.filter(row => selectedRowKeys.includes(row.id));
  console.log("Selected rows:", selectedRows);
  for (const row of selectedRows) {
    const newQuantity = row.quantity - 1;
    // Insert into Orders table
  
      if (newQuantity <= 0) {
        // Delete the row if quantity is 0 or less
        const { error } = await supabase
          .from("Food")
          .delete()
          .eq("id", row.id);
  
        if (error) {
          console.error(`Error deleting food with id ${row.id}:`, error);
        } else {
          console.log(`Deleted food with id ${row.id}`);
        }
      } else {
        // Otherwise, just update the quantity
        const { error } = await supabase
          .from("Food")
          .update({ quantity: newQuantity })
          .eq("id", row.id);
  
        if (error) {
          console.error(`Error updating food with id ${row.id} to quantity ${newQuantity}:`, error);
        } else {
          console.log(`Updated food with id ${row.id} to quantity ${newQuantity}`);
        }
        const { error: orderError } = await supabase
        .from("Orders")
        .insert([
          {
            event_id: id,
            student_id: 1,       // You can replace with actual user if you have one
            food_id: row.id,
          },
        ]);
  
      if (orderError) {
        console.error(`Error creating order for food id ${row.id}:`, orderError);
        continue; // skip update/delete if order creation fails
      }
      }
    }
  
    await fetchFoods(); // refresh the data
  };
  

  // setUnit("g");
  const allergies: Record<string, string> = {
    "dairy": "/allergyIcons/dairy-free.png",
    "egg": "/allergyIcons/egg-free.png",
    "fish": "/allergyIcons/fish-free.png",
    "gluten": "/allergyIcons/gluten-free.png", 
    "peanut": "/allergyIcons/peanut-free.png",
    "seafood": "/allergyIcons/seafood-free.png",
    "soy": "/allergyIcons/soy-free.png",
    "tree Nut": "/allergyIcons/treeNut-free.png"
  }
  const imgs: Record<string, string> = {
    "cds": "/CDS.jpg",
    "warren": "/WarrenTowers.jpg",
    "gsu": "/GSU.JPEG",
  }
  const columns = [
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
              <Tooltip key={index} title={`${item} allergy`} > 
                <Image key={index} width={16} height={16} style={{ position: "relative", bottom: "4px" }} src={allergies[item]} alt={item} />
              </Tooltip>
            ))}
          </div>
        ),
    },
  ];
  useEffect(() => {
    const fetchFoods = async () => {
      const { data, error } = await supabase
        .from('Food')
        .select('*')
        .eq('event_id', id);

      if (error) {
        console.error('Error fetching food:', error.message);
      } else {
        setFood(data);
      }

      setLoading(false);
    };

    if (id) {
      fetchFoods();
    }
  }, [id]); // re-run if creatorId changes
  return (
    <>
    <Card
      hoverable
      style={cardStyles}
      onClick={() => {
        setIsModalVisible(true)
      }} 
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
      <p style={timeStyle}>{time_start} - {time_end}</p>
    </Card>
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
        <Card title={`${location} - Food Options`} style={{ height: "100%", width: "100%" }}
        >
          <Flex
            justify="start"
            align="flex-start"
          >
            <div 
            style={{ width: "30%", height: "500px", position: "relative" }}
            >
                <Image
                  src={imgs[location]}
                  alt={location}
                  fill
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                />
              </div>
              <div style={{ width: "70%", height: "500px", position: "relative"}}>
                <h1 style={{textAlign: "center"}}>Food Available</h1>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center"

                }}>
                  {
                    loading ? <p>loading...</p> : ( 
                      <>
                        <Table dataSource={food} columns={columns} style={{width: "75%"}} rowKey="id" />
                        <div style={{gap: "8px"}}>
                          <Button>Reserve Item</Button>
                          <Button>Clear All</Button>
                        </div>
                      </>
                    )
                  }
                  
                </div>
                
              </div>
          </Flex>
          
        </Card>
      </Modal>
    </>
  );
}


const cardStyles = { //had to put it in these cus for some reason the styling wouldn't work
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  width: "25%",
  padding: "0.5em"
};
// const buttonStyle = { 
//   width: "25px"
// }
const timeStyle = {
  fontWeight: "bold",
  color: "#555",
};
