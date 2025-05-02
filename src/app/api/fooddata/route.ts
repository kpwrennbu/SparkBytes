import { NextRequest, NextResponse } from 'next/server'; //imports needed for an GET request in Next
import {USDAApiResponse, FoodItem} from "@/types"; //types for typescript


export async function GET(req: NextRequest) { //header, for a get request in next
  // 1. Get the search term from the query string (?query=banana)
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get('query');

  // 2. Get the API key from environment variables
  const apiKey = process.env.FOOD_DATA_CENTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Food Data Central API key' }, { status: 500 });
  }

  // 3. Construct the USDA API URL (limit to 50 results)
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${searchTerm}&pageSize=50`;

  try {
    const apiRes = await fetch(url);


    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      return NextResponse.json({ error: errorText }, { status: apiRes.status });
    }

    const data: USDAApiResponse = await apiRes.json();
    const foods: FoodItem[]  = data.foods || [];

    console.log("🔍 Raw USDA API results:");
    console.log(data.foods?.map((food: FoodItem) => ({
      description: food.description,
      servingSize: food.servingSize,
      servingSizeUnit: food.servingSizeUnit,
      fdcId: food.fdcId
    })));

    // 4. Find the first item with serving size >= 5g
    const food = foods.find((item) => item.servingSize && item.servingSize >= 5);

    // 5. Return early if no valid results found
    if (!food) {
      return NextResponse.json({ foods: [] });
    }

    const nutrients = food.foodNutrients || [];

    // 6. Helper to extract nutrient value by name
    function getNutrient(name: string): number {
      const found = nutrients.find((n) => n.nutrientName === name);
      return found ? found.value : 0;
    }

    // 7. Get nutrient values (assumed to be per 100g)
    const carbsPer100 = getNutrient("Carbohydrate, by difference");
    const proteinPer100 = getNutrient("Protein");
    const fatPer100 = getNutrient("Total lipid (fat)");
    const caloriesPer100 = getNutrient("Energy");

    const servingSize = food.servingSize || 100;

    // 8. Compute nutrient values per serving
    const carbsPerServing = (carbsPer100 * servingSize) / 100;
    const proteinPerServing = (proteinPer100 * servingSize) / 100;
    const fatPerServing = (fatPer100 * servingSize) / 100;
    const caloriesPerServing = (caloriesPer100 * servingSize) / 100;

    // 9. Check for allergens in the ingredients string
    const allergenKeywords = ["milk", "egg", "peanut", "shellfish", "wheat", "soy", "sesame", "pork"];
    let foundAllergens: string[] = [];
    if (food.ingredients) {
      const ingredients = food.ingredients.toLowerCase();
      foundAllergens = allergenKeywords.filter((keyword) => ingredients.includes(keyword));
    }

    // 10. Build result object with all the information
    const result = {
      fdcId: food.fdcId,
      description: food.description,
      servingSize,
      servingSizeUnit: food.servingSizeUnit || "g",
      brandOwner: food.brandOwner || null,
      // Macros per 100 g
      carbsPer100,
      proteinPer100,
      fatPer100,
      caloriesPer100,
      // Macros per serving
      carbsPerServing,
      proteinPerServing,
      fatPerServing,
      caloriesPerServing,
      // Detected allergens
      allergens: foundAllergens,
    };

    // 11. Return the wrapped response
    return NextResponse.json({ foods: [result] });

  } catch (err) {
    console.error('FDC API fetch error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}