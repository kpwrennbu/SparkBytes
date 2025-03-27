"use client";

import { useState } from "react";

export default function AboutPage() {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setFoods([]);

    try {
      const res = await fetch(`/api/fooddata?query=${query}`);
      if (!res.ok) {
        throw new Error("API call failed");
      }
      const data = await res.json();
      console.log("USDA Data:", data);

      if (data.foods && data.foods.length > 0) {
        setFoods(data.foods);
      } else {
        setError("No foods found");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1em" }}>
      <h1>About Page</h1>
      <p>Search the USDA Food Database</p>

      <div style={{ marginBottom: "1em" }}>
        <input
          type="text"
          placeholder="e.g. banana"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} style={{ marginLeft: "1em" }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {foods.map((food) => (
        <div
          key={food.fdcId}
          style={{
            border: "1px solid #ccc",
            padding: "1em",
            marginBottom: "1em",
            borderRadius: "8px",
          }}
        >
          <h2>{food.description}</h2>
          {food.brandOwner && <p>Brand: {food.brandOwner}</p>}
          <p>
            Serving Size: {food.servingSize} {food.servingSizeUnit || "g"}
          </p>

          <h3>Macros (per 100 g):</h3>
          <ul>
            <li>Carbs: {food.carbsPer100} g</li>
            <li>Protein: {food.proteinPer100} g</li>
            <li>Fat: {food.fatPer100} g</li>
          </ul>

          <h3>Macros (per serving):</h3>
          <ul>
            <li>Carbs: {food.carbsPerServing.toFixed(2)} g</li>
            <li>Protein: {food.proteinPerServing.toFixed(2)} g</li>
            <li>Fat: {food.fatPerServing.toFixed(2)} g</li>
          </ul>

          <h3>Common Allergens:</h3>
          {food.allergens && food.allergens.length > 0 ? (
            <ul>
              {food.allergens.map((allergen: string, idx: number) => (
                <li key={idx}>{allergen}</li>
              ))}
            </ul>
          ) : (
            <p>No common allergens detected.</p>
          )}
        </div>
      ))}
    </div>
  );
}