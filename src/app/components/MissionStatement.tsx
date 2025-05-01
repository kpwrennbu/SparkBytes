import React from "react";
import { Typography } from "antd";
import Image from "next/image";
import {styles} from "../utils/missionStatement.utils"
const { Title, Paragraph } = Typography;

export default function MissionStatement() {
  
  return (
    <div
      style={styles.wrapper as React.CSSProperties}
    >
      <div style={styles.iconWrapper}>
        <Image
          src="/Spark.png"
          alt="SparkBytes Logo"
          width={350}
          height={200}
        />
      </div>

      <Title level={1} style={styles.title}>
        SPARK!BYTES
        <br />
      </Title>
      <Paragraph style={styles.subTitle}>
        FREE ACCESS TO SURPLUS OF FOOD
      </Paragraph>

      <div style={styles.missionStatementWrapper} />

      <Paragraph style={styles.missionStatementText}>
        Spark!Bytes is an innovative software platform that allows BU to
        efficiently redistribute surplus food from events and programs to
        students, staff, and professors. By connecting available food with
        students in need, SparkBytes reduces waste, supports sustainability, and
        strengthens community access across campus.
      </Paragraph>
    </div>
  );
}
