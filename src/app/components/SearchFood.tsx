"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Space,
  message,
  Tag,
} from "antd";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";

const { Title, Text } = Typography;

export default function SearchFood({ setIsTableVisible, foods, setFoods}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setFoods([]);

    try {
      const res = await fetch(`/api/fooddata?query=${query}`);
      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      if (data.foods && data.foods.length > 0) {
        setFoods(data.foods);
      } else {
        setError("No foods found.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  const addToFoodDB = async () => {
    const food = foods[0];
    const { data, error } = await supabase.from("Food").insert([
      {
        name: food.description,
        serving_size: `${food.servingSize}${food.servingSizeUnit || "g"}`,
        carbs: food.carbsPerServing,
        proteins: food.proteinPerServing,
        fats: food.fatPerServing,
        allergies: food.allergens,
        quantity: 1,
      },
    ]);

    if (error) {
      message.error("Error adding food to DB.");
      console.error("Insert error:", error);
    } else {
      message.success("Item added to Food DB!");
    }

    setFoods([]);
  };


  return (
    <div style={{ padding: "1em", maxWidth: 720, margin: "0 auto" }}>
      <Text strong>Food Picker :</Text>
      <br />
      <Text>Search the USDA Food Database</Text>

      <Space.Compact style={{ width: "100%", margin: "1em 0" }}>
        <Input
          placeholder="e.g. banana"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="primary" onClick={handleSearch} loading={loading}>
          Search
        </Button>
      </Space.Compact>

      {error && <Text type="danger">{error}</Text>}

      {foods.map((food) => (
        <Card
          key={food.fdcId}
          bordered
          style={{
            marginBottom: 16,
            maxWidth: "100%",
          }}
        >
          <Title
            level={3}
            style={{
              color: "#389e0d",
              marginBottom: "0.25em",
              fontWeight: 600,
            }}
          >
            {food.description}
          </Title>

          <Text strong>
            Serving Size: {food.servingSize} {food.servingSizeUnit || "g"}
          </Text>

          <div style={{ marginTop: "1em" }}>
            <Title level={5} style={{ marginBottom: 0 }}>
              Macros <Text type="secondary">(per serving)</Text>:
            </Title>
            <ul style={{ marginTop: 4 }}>
              <li>Carbs: {food.carbsPerServing.toFixed(2)} g</li>
              <li>Protein: {food.proteinPerServing.toFixed(2)} g</li>
              <li>Fat: {food.fatPerServing.toFixed(2)} g</li>
            </ul>
          </div>

          <div style={{ marginTop: "1em" }}>
            <Title level={5} style={{ marginBottom: 4 }}>
              Common Allergens:
            </Title>
            {food.allergens && food.allergens.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {food.allergens.map((allergen: string, idx: number) => (
                  <Tag
                    key={idx}
                    color="red"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.25em 0.5em",
                    }}
                  >
                    <Image
                      src={`/allergyIcons/${allergen.toLowerCase()}-free.png`}
                      alt={allergen}
                      width={16}
                      height={16}
                    />
                    {allergen}
                  </Tag>
                ))}
              </div>
            ) : (
              <Text type="secondary">No common allergens detected.</Text>
            )}
          </div>

          <Button
            type="primary"
            block
            style={{ marginTop: "1em", backgroundColor: "#52c41a" }}
            onClick={addToFoodDB}
          >
            Add item to Food DB
          </Button>
        </Card>
      ))}

    </div>
  );
}