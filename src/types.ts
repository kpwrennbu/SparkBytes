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
    servingSize: number;
    servingSizeUnit: string;
  };
  
  // A row displayed in the event’s food table
  export type TableRow = {
    key: number;
    food: string;
    quantity: number;
    serving_size: string;
    proteins: number;
    fats: number;
    carbs: number;
    allergies: string[];
  };
  
  // Props passed to SearchFood component
  export type SearchFoodProps = {
    isTableVisible: boolean;
    setIsTableVisible: React.Dispatch<React.SetStateAction<boolean>>;
    foods: Food[];
    setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
    quantity: number, 
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
  };

//props passed to the Form of the CreateEvent component
 export type FormValues = {
    eventName: string;
    location: string;
    customizeGender?: string; // optional if conditional
  };