// src/types.ts

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
    isTableVisible: boolean;
    setIsTableVisible: React.Dispatch<React.SetStateAction<boolean>>;
    foods: Food[];
    setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
    quantity: number, 
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    addFoodToEventsTable: AddFoodToEventsTable;
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
  