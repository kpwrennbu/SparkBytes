import { Input, Select, DatePicker, TimePicker } from "antd";
import type { EventFormProps } from "@/types";
import type { Dayjs } from "dayjs";
const { Option } = Select;
const format = "HH:mm a";

export default function EventForm({ eventName, setEventName, location, setLocation, eventDate, setEventDate, timeRange, setTimeRange }: EventFormProps) {
  return (
    <>
      <Input placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      <Select placeholder="Select a location" value={location} onChange={setLocation} style={{ width: "100%" }} >
        <Option value="warren">Warren Towers</Option>
        <Option value="cds">Center for Computing and Data Sciences</Option>
        <Option value="gsu">George Sherman Union</Option>
      </Select>
      <DatePicker value={eventDate} onChange={setEventDate} style={{ width: "100%" }} />
      <TimePicker.RangePicker use12Hours format={format} value={timeRange}   onChange={(dates) => setTimeRange(dates as [Dayjs, Dayjs] | null)}
 style={{ width: "100%" }} />
    </>
  );
}
