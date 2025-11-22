import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
});

function QuizPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goals, setGoals] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Process the quiz answers
  };

  return (
    <div className="min-h-screen bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Nutrition Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mt-1 input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Goals</label>
          <select
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="mt-1 select select-bordered w-full"
          >
            <option value="">Select your goal</option>
            <option value="gain 10 pounds of muscle">
              Gain 10 pounds of muscle
            </option>
            <option value="lose 10 pounds">Lose 10 pounds</option>
            <option value="maintain weight">Maintain current weight</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Weight (lbs)</label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            className="mt-1 input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Height (inches)</label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height"
            className="mt-1 input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Dietary Restrictions
          </label>
          <select
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            className="mt-1 select select-bordered w-full"
          >
            <option value="">Select dietary restrictions</option>
            <option value="none">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-free</option>
            <option value="dairy-free">Dairy-free</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Cooking Time</label>
          <select
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            className="mt-1 select select-bordered w-full"
          >
            <option value="">Select cooking time</option>
            <option value="30 mins">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="2 hours">2 hours</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Budget</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1 select select-bordered w-full"
          >
            <option value="">Select your budget</option>
            <option value="less than 100">Less than $100/week</option>
            <option value="100 to 300">Between $100 - $300/week</option>
            <option value="more than 300">Over $300/week</option>
          </select>
        </div>
        <button type="submit" className="mt-4 btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
