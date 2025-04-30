import { useState } from "react";
import type { Food, TableRow } from "@/types";
import supabase from "@/app/api/supabaseClient";
import type { Dayjs } from "dayjs";

export function useCreateEvent() {
  //All of are states are here
  const [isModalVisible, setIsModalVisible] = useState(false); //For the createEvent Popup
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [quantity, setQuantity] = useState(1); //For quantity
  const [unit, setUnit] = useState(""); //For the unit
  const [isChecked, setIsChecked] = useState(false); ///For the toggle Switch
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [finalEventError, setFinalEventError] = useState("");

  const clearCreateEvent = () => {
    setEventName(""); 
    setLocation(""); 
    setEventDate(null);
    setTimeRange(null);
    setTableData([]); 
    setFoods([]); 
    setQuantity(1); 
    setUnit(""); 
    setIsChecked(false); 
    setSelectedRowKeys([]);
    setFinalEventError("");
  };
  //function to add Food to the Events Table
  const addFoodToEventsTable = (food: Food) => {
    if (quantity <= 0) return;
    const newData: TableRow = {
      key: Date.now() + Math.random(), //function we created to make a random key
      food: food.description,
      quantity,
      servingSizeUnit: food.servingSizeUnit,
      calories: food.caloriesPerServing,
      proteins: food.proteinPerServing,
      fats: food.fatPerServing,
      carbs: food.carbsPerServing,
      allergies: food.allergens,
    };
    setTableData((prev) => [...prev, newData]); //set table data to include need food
    setFoods([]); //clear the food
    setQuantity(1); //reset quantity
    if (unit !== "g") setUnit(food.servingSizeUnit); //set unit
  };
  //function to add Manually Inputted food to the table data
  const addInputtedToEventsTable = (row: TableRow) => {
    console.log("Got here");
    setTableData((prev) => [...prev, row]);
  };
  const addEventToDB = async () => {
    console.log("tableData: ", tableData); //log table data, for debugging

    //if check to make sure if the user put in all fields, if not set the error to display later
    if (
      !eventDate ||
      !timeRange ||
      !location ||
      !eventName ||
      tableData.length === 0
    ) {
      setFinalEventError(
        "Error. Please make sure you have entered food and credentials"
      );
      return;
    }
    //get and format the times
    const [startTime, endTime] = timeRange;
    const time_start = eventDate
      .clone()
      .hour(startTime.hour())
      .minute(startTime.minute())
      .second(0)
      .format();
    const time_end = eventDate
      .clone()
      .hour(endTime.hour())
      .minute(endTime.minute())
      .second(0)
      .format();

    //Put the event in the Events table, get back to the id
    const { data, error } = await supabase
      .from("Events")
      .insert([
        { name: eventName, location, time_start, time_end, creator_id: 1 },
      ])
      .select();
    if (error) return;
    //gets the event ID
    const eventId = data?.[0]?.id;

    //now, for each food in the Table, put it to the DB and link it with the event_id from the previous DB call
    for (const row of tableData) {
      await supabase.from("Food").insert([
        {
          event_id: eventId,
          total_quantity: row.quantity,
          quantity_left: row.quantity,
          name:
            row.food.charAt(0).toUpperCase() + row.food.slice(1).toLowerCase(),
          calories: Math.round(row.calories),
          carbs: Math.round(row.carbs),
          proteins: Math.round(row.proteins),
          fats: Math.round(row.fats),
          allergies: row.allergies,
          serving_size_unit: unit,
        },
      ]);
    }
    setIsModalVisible(false); //close the popup

    // Fetch all users from Supabase
    const { data: users, error: usersError } = await supabase
      .from("userinfo") // make sure your user profile table is actually called 'Users'
      .select("email"); //get all emails

    if (usersError) {
      console.error("❌ Failed to fetch user emails:", usersError.message); //return any errors
      return;
    }

    const foodList = tableData //make a food list of all foods at the event
      .map(
        (item) =>
          `🍴 ${item.food[0].toUpperCase() + item.food.slice(1).toLowerCase()}`
      )
      .join("\n");

  //message for the emailm formamted
    const message = `
🎉 A new event just dropped!

📍 *${eventName}*  
🗺️ Location: ${
      location === "cds"
        ? "Center for Computing and Data Sciences"
        : location === "gsu"
        ? "George Sherman Union"
        : "Warren Towers"
    }  
🕒 Time: ${new Date(time_start).toLocaleString()} - ${new Date(
      time_end
    ).toLocaleString()}

Here's what’s on the menu:

${foodList}

Tap into the app to grab your favorites before they’re gone! 😋
`;

    console.log("starting with email logic"); //email logic debug
    // Send emails to all users
    for (const user of users) {
      if (user.email.endsWith("@bu.edu")) {
        await fetch("/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.email,
            subject: `New Event: ${eventName}`,
            text: message,
          }),
        });
      }
    }
    console.log("done with email logic");
    clearCreateEvent();
  };
  
  //returns all the states
  return {
    isModalVisible,
    setIsModalVisible,
    eventName,
    setEventName,
    location,
    setLocation,
    eventDate,
    setEventDate,
    timeRange,
    setTimeRange,
    tableData,
    setTableData,
    foods,
    setFoods,
    quantity,
    setQuantity,
    unit,
    setUnit,
    isChecked,
    setIsChecked,
    selectedRowKeys,
    setSelectedRowKeys,
    finalEventError,
    setFinalEventError,
    addFoodToEventsTable,
    addInputtedToEventsTable,
    addEventToDB,
  };
}
