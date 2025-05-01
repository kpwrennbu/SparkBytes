import { Typography, Flex, Switch } from "antd";
import SearchFood from "../SearchFood";
import ManuallyInputFood from "../ManuallyInputFood";
import type { FoodSelectorProps } from "@/types";
export default function FoodSelector(props: FoodSelectorProps) {
  return (
    <div>
      <Flex align="center" justify="center" gap="1em">
        <Typography.Title level={4} style={{ margin: 0 }}>
          {props.isChecked ? "Add Custom Food" : "Search Food"}
        </Typography.Title>
        <Switch
          checked={props.isChecked}
          onChange={props.setIsChecked}
          style={{
            backgroundColor: props.isChecked ? "#52c41a" : "#d9d9d9", // green or gray
          }}
        />
      </Flex>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}
      >
        {props.isChecked ? (
          <ManuallyInputFood
            tableData={props.tableData}
            setTableData={props.setTableData}
          />
        ) : (
          <SearchFood
            foods={props.foods}
            setFoods={props.setFoods}
            quantity={props.quantity}
            setQuantity={props.setQuantity}
            addFoodToEventsTable={props.addFoodToEventsTable}
            tableData={props.tableData}
          />
        )}
      </div>
    </div>
  );
}
