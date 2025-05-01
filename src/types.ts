// src/types.ts
import type { FormInstance } from "antd";
import type { ReactNode, HTMLAttributes } from "react";
import type { Dayjs } from "dayjs";
// A food item returned from API or used in event creation

export type Food = {
    allergens: string[];
    brandOwner: string;
    carbsPer100: number;
    carbsPerServing: number;
    description: string;
    fatPer100: number;
    fatPerServing: number;
    fdcId: number;
    proteinPer100: number;
    proteinPerServing: number;
    caloriesPer100: number;
    caloriesPerServing: number; 
    servingSize: number;
    servingSizeUnit: string;
  };
  
  // A row displayed in the event’s food table
  export type TableRow = {
    key: number;
    food: string;
    quantity: number;
    servingSizeUnit: string;
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
    allergies: string[];
  };
  
  // Props passed to SearchFood component
  export type AddFoodToEventsTable = (food: Food) => void;

  export type SearchFoodProps = {
    foods: Food[];
    setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
    quantity: number, 
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    addFoodToEventsTable: AddFoodToEventsTable;
    tableData: TableRow[];
  };

//props passed to the Form of the CreateEvent component
 export type FormValues = {
    eventName: string;
    location: string;
    customizeGender?: string; // optional if conditional
  };

  export type EventRow = {
    id: number;
    name: string;
    location: string;
    time_start: string;
    time_end: string;
    creator_id: number;
  };
  

//USDA Types

//Food Nutrient type for USDA API Call
export interface FoodNutrient {
    nutrientName: string;
    value: number;
  }
  
  //Food Item type for USDA API Call
  export interface FoodItem {
    fdcId: number;
    description: string;
    servingSize?: number;
    servingSizeUnit?: string;
    brandOwner?: string;
    foodNutrients: FoodNutrient[];
    ingredients?: string;
  }
   
  // USDA API Response type

  export interface USDAApiResponse {
    foods: FoodItem[];
  }
  

//Event Form Props
  export interface EventFormProps {
  eventName: string;
  setEventName: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  eventDate: Dayjs | null;
  setEventDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  timeRange: [Dayjs, Dayjs] | null;
  setTimeRange: React.Dispatch<React.SetStateAction<[Dayjs, Dayjs] | null>>;
}

export interface FoodTableProps { 
  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
  unit: string;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
}

//Editable TableCell Props
export interface EditableCellProps extends HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: "number" | "text";
    index: number;
    children: ReactNode;
    form: FormInstance;
  }
  
export interface FoodSelectorProps {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;

  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
  
  addInputtedToEventsTable: (row: TableRow) => void;

  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;

  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;

  addFoodToEventsTable: (food: Food) => void;
}

export interface ManuallyInputFormValues {
  food: string;
  quantity: number;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  allergies: string[];
  servingSizeUnit: string;
}
export interface ManuallyInputFoodProps { 
  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;

}

export interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text";
  index: number;
  children: ReactNode;
}
//FoodItem type for a Reservation Row 
export type ReservationItem = {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  allergies: string[];
  quantity_left: number;
  total_quantity: number;
  serving_size_unit: string;
  event_id: number;
  created_at: string; // or Date if you plan to convert it
};

export type SupabaseUserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_coordinator: number; // or boolean if you're coercing it
  avatar_url: string | null;
  created_at: string; // ISO timestamp
};

export type OrderItem = {
  id: number;
  grabber_id: string;
  food: {
    id: number;
    name: string;
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
    quantity_left: number;
    total_quantity: number;
    allergies: string[];
    serving_size_unit: string;
    event_id: number;
    event: {
      name: string;
      location: string;
      time_end: string;
    };
  };
};



