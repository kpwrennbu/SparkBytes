"use client";
import { useState } from "react";
import { Card, Modal, Flex, Table, Button} from "antd";
import Image from "next/image";

interface FoodItem {
  key: number;
  food: string;
  quantity: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  allergies: string[];
}

interface EventProps {
  location: string;
  description: string;
  time: string;
  img: string;
  food: FoodItem[];
}

export default function FoodCard({ location, description, time, img, food }: EventProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log(food)


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

  return (
    <>
    <Card
      hoverable
      style={cardStyles}
      onClick={() => setIsModalVisible(true)} 
      cover={
        <div style={{ width: "100%", height: "200px", position: "relative" }}>
          <Image
            src={img}
            alt={location}
            fill
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        </div>
      }
    >
      <h3 style={{ marginBottom: "5px", fontWeight: "bold" }}>{location}</h3>
      <p style={{ color: "#666", marginBottom: "8px" }}>{description}</p>
      <p style={timeStyle}>{time}</p>
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
                  src={img}
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
                  <Table dataSource={food} columns={columms} style={{width: "75%"}}/>
                  <div style={{gap: "8px"}}>
                    <Button>Reserve Item</Button>
                    <Button>Clear All</Button>
                  </div>
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
