import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 1. Get the search term from the query string (?query=banana)
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get('query');

  // 2. Get the API key from environment variables
  const apiKey = process.env.FOOD_DATA_CENTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Food Data Central API key' }, { status: 500 });
  }

  // 3. Construct the USDA API URL (limit to 1 result)
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${searchTerm}&pageSize=1`;

  try {
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      return NextResponse.json({ error: errorText }, { status: apiRes.status });
    }

    const data = await apiRes.json();
    const topResult = data.foods?.[0] || null;
    if (!topResult) {
      return NextResponse.json({ foods: [] });
    }

    // 4. Extract macronutrients from the foodNutrients array
    const nutrients = topResult.foodNutrients || [];
    function getNutrientValue(nutrientName: string): number {
      const found = nutrients.find((n: any) => n.nutrientName === nutrientName);
      return found ? found.value : 0;
    }

    // Values (assumed to be per 100 g)
    const carbsPer100 = getNutrientValue('Carbohydrate, by difference');
    const proteinPer100 = getNutrientValue('Protein');
    const fatPer100 = getNutrientValue('Total lipid (fat)');

    // 5. Get serving size (default to 100 g if not provided)
    const servingSize = topResult.servingSize || 100;

    // 6. Calculate macros per serving
    const carbsPerServing = (carbsPer100 * servingSize) / 100;
    const proteinPerServing = (proteinPer100 * servingSize) / 100;
    const fatPerServing = (fatPer100 * servingSize) / 100;

    // 7. Parse ingredients to check for common allergens
    // Define a list of allergen keywords
    const allergenKeywords = ["milk", "egg", "peanut", "shellfish", "wheat", "soy", "sesame", "pork"];
    let foundAllergens: string[] = [];
    if (topResult.ingredients) {
      const ingredientsStr = topResult.ingredients.toLowerCase();
      foundAllergens = allergenKeywords.filter(keyword => ingredientsStr.includes(keyword));
    }

    // 8. Build the result object including nutritional facts and allergens
    const topResultWithMacros = {
      fdcId: topResult.fdcId,
      description: topResult.description,
      servingSize,
      servingSizeUnit: topResult.servingSizeUnit,
      brandOwner: topResult.brandOwner || null,
      // Macros per 100 g
      carbsPer100,
      proteinPer100,
      fatPer100,
      // Macros per serving
      carbsPerServing,
      proteinPerServing,
      fatPerServing,
      // Common allergens detected
      allergens: foundAllergens,
    };

    // 9. Return the data in an object (wrapped in an array for easier mapping on the frontend)
    return NextResponse.json({
      foods: [topResultWithMacros],
    });
  } catch (err) {
    console.error('FDC API fetch error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}