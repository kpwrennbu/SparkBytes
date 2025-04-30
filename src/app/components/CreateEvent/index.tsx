"use client";
import { Button, Modal, Typography, Flex } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useCreateEvent } from "./useCreateEvent";
import EventForm from "./EventForm";
import FoodSelector from "./FoodSelector";
import FoodTable from "./FoodTable";
export default function CreateEvent() {
  const state = useCreateEvent();

  return (
    <>
      <Button icon={<PlusCircleOutlined />} onClick={() => state.setIsModalVisible(true)} />
      <Modal open={state.isModalVisible} onCancel={() => state.setIsModalVisible(false)} footer={null} width="90vw">
        <Typography.Title level={2} style={{ textAlign: "center" }}>Create an Event</Typography.Title>

        <Flex wrap="wrap" gap="48px" justify="center">
          <div style={{ width: "300px", marginTop: "50px" }}>
            <Typography.Title level={4}>Event Details</Typography.Title>
            <EventForm 
              eventName={state.eventName}
              setEventName={state.setEventName}
              location={state.location}
              setLocation={state.setLocation}
              eventDate={state.eventDate}
              setEventDate={state.setEventDate}
              timeRange={state.timeRange}
              setTimeRange={state.setTimeRange}
            />
          </div>
          <div style={{ flexGrow: 1, minWidth: "500px" }}>
    <Typography.Title level={4}>Current Food Items</Typography.Title>
    <FoodTable
      tableData={state.tableData}
      setTableData={state.setTableData}
      unit={state.unit}
      selectedRowKeys={state.selectedRowKeys}
      setSelectedRowKeys={state.setSelectedRowKeys}
    />
  </div>

         
        </Flex>

        <div style={{ marginTop: "2rem" }}>
          <FoodSelector {...state} />
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Button type="primary" onClick={state.addEventToDB} style={{background: "#52c41a"}}>Add Event</Button>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
          {state.finalEventError && <Typography.Text type="danger">{state.finalEventError}</Typography.Text>}
          </div>
          
        </div>
      </Modal>
    </>
  );
}
