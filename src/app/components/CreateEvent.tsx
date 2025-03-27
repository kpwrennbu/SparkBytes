"use client";
import { useState } from "react";
import { Modal, Button } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
export default function CreateEvent() {
  const [isModalVisible, setIsModalVisible] = useState(false);
//   const allergies: Record<string, string> = {
//     "Dairy": "/allergyIcons/dairy-free.png",
//     "Egg": "/allergyIcons/egg-free.png",
//     "Fish": "/allergyIcons/fish-free.png",
//     "Gluten": "/allergyIcons/gluten-free.png", 
//     "Peanut": "/allergyIcons/peanut-free.png",
//     "Seafood": "/allergyIcons/seafood-free.png",
//     "Soy": "/allergyIcons/soy-free.png",
//     "Tree Nut": "/allergyIcons/treeNut-free.png"
//   }

  return (
    <>
    <Button icon={<PlusCircleOutlined />} onClick={() => setIsModalVisible(true)} />
    
    
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
        text
      </Modal>
    </>
  );
}


// const cardStyles = { //had to put it in these cus for some reason the styling wouldn't work
//   borderRadius: "10px",
//   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//   width: "25%",
//   padding: "0.5em"
// };
// // const buttonStyle = { 
// //   width: "25px"
// // }
// const timeStyle = {
//   fontWeight: "bold",
//   color: "#555",
// };
