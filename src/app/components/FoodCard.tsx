// src/app/components/FoodCard.tsx
"use client";
import { useState, useEffect } from "react"; //react hooks
import { Card, Modal, Flex, Table, Button, Tooltip } from "antd"; //antd UI imports
import Image from "next/image"; //next image component
import { EventRow, ReservationItem} from "@/types"; //type imports
import supabase from "../api/supabaseClient"; //supabase imports
import {
  allergies,
  imgs,
  formattedLocations,
  addresses,
  formatTimeRange,
  styles
} from "../utils/foodCard.utils";

export default function FoodCard({ id, name, location, time_start, time_end }: EventRow) {
  //states
  const [isModalVisible, setIsModalVisible] = useState(false); //used to expand the foodCard
  const [loading, setLoading] = useState(false); //used to signal if food items are loading
  const [food, setFood] = useState<ReservationItem[]>([]); //used to get food from the db call
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); //used to know the selected row to place a user's orders
  const [userId, setUserId] = useState<string | null>(null); //get user id state so we can make the order for that specific user

  useEffect(() => {
    //fetch user
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(); //supabase call to get the user

      if (error) {
        console.error("Failed to fetch user:", error.message);
      } else if (user) {
        setUserId(user.id); // this is the user's UUID
      }
    };

    fetchUser();
  }, []);

  //param for the FoodTable for each food card. Just holds the selected rows and onChange, which fires the setSelectedRowKeys when a new key gets selected / deselected
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  //reserving our order logic
  const onReservation = async () => {
    const selectedRows = food.filter(row => selectedRowKeys.includes(row.id)); ///first, get all the selected rows by IDs

    //for each of these selected rows, we must decrement the quantity, and the insert the order into the order table (event_id, grabber_id (the student), and the food id)
    for (const row of selectedRows) {
      console.log("row: ", row)
      const newQuantityLeft = row.quantity_left - 1;

      const { error: orderError } = await supabase
        .from("Orders")
        .insert([
          {
            event_id: id,
            grabber_id: userId,
            food_id: row.id,
          },
        ]);

      if (orderError) {
        console.error(`Error creating order for food id ${row.id}:`, orderError);
        continue;
      }

      //then, we must update the quantity left with the decremented quantity
      const { error } = await supabase
        .from("Food")
        .update({ quantity_left: newQuantityLeft })
        .eq("id", row.id);

      if (error) {
        console.error(`Error updating quantity_left for food id ${row.id}:`, error);
      }
    }
    
    await fetchFoods(); //fetch the new foods
    setSelectedRowKeys([]); //set the selected keys to nothing
    setIsModalVisible(false); //close the modal after order
  };

  //columns for the table, hardcoded for simplicity
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
      render: (val: number) => <div>{Math.round(val) + "g"}</div>,
    },
    {
      title: "Carbs",
      dataIndex: "carbs",
      key: "carbs",
      render: (val: number) => <div>{Math.round(val) + "g"}</div>,
    },
    {
      title: "Fat",
      dataIndex: "fats",
      key: "fats",
      render: (val: number) => <div>{Math.round(val) + "g"}</div>,
    },
    {
      title: "Allergies",
      dataIndex: "allergies",
      key: "allergies",
      render: (allergy: string[]) => //maps the allergies to their icons if applicable
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

  //this is to fetch foods for the Table for the FoodCard. here we see we just do A DB call to the food table, grab all the foods with the same event id, and with quantity left (quantity left that is greater than 0)
  const fetchFoods = async () => {
    const { data, error } = await supabase
      .from("Food")
      .select("*")
      .eq("event_id", id)
      .gt("quantity_left", 0);

    if (error) {
      console.error("Error fetching food:", error.message); //log error if any
    } else {
      setFood(data); //set Food to data given back
    }

    setLoading(false); //signal that we are done loading
  };

  //use effect to continously call it per user
  useEffect(() => {
    if (id) {
      fetchFoods();
    }
  });


  return (
    <>
      <Card
  hoverable
  style={styles.card}
  onClick={() => userId && setIsModalVisible(true)}
  cover={
    <div style={styles.imageCover}>
      <Image
        src={imgs[location]}
        alt={location}
        fill
        style={{ objectFit: "cover", borderRadius: "10px" }}
      />
    </div>
  }
>
  <h3 style={styles.eventName}>{name}</h3>
  <p style={styles.locationText}>
    {formattedLocations[location] + ": " + addresses[location]}
  </p>
  <p style={styles.time}>{formatTimeRange(time_start, time_end)}</p>
</Card>

<Modal
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  width="100vw"
  style={{ top: 0, padding: 0 }}
  styles={{ body: styles.modalBody }}
>
  <Card title={`${formattedLocations[location]} - Food Options`} style={{ height: "100%", width: "100%" }}>
    <Flex justify="start" align="flex-start">
      <div style={styles.modalImage}>
        <Image
          src={imgs[location]}
          alt={location}
          fill
          style={{ objectFit: "cover", borderRadius: "10px" }}
        />
      </div>

      <div style={styles.modalContent}>
        <h1 style={{ textAlign: "center" }}>Food Available</h1>
        <div style={styles.tableWrapper}>
          {loading ? (
            <p>loading...</p>
          ) : (
            <>
              <Table
                dataSource={food}
                columns={columns}
                style={styles.table}
                rowKey="id"
                rowSelection={rowSelection}
              />
              <div style={styles.buttonGroup}>
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