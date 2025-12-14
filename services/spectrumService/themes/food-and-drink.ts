import type { SpectrumCard } from "../../../types";

export const FOOD_AND_DRINK_THEME: { name: string; image: string; cards: SpectrumCard[] } = {
  name: 'Food & Drink',
  image: '/static/themes/food-and-drink.png',
  cards: [
  { left: "Comfort Food", right: "Fancy Food" },
  { left: "Overseasoned", right: "Underseasoned" },
  { left: "More Filling", right: "More Flavorful" },
  { left: "Everyday Food", right: "Special Occasion Food" },
  { left: "Looks Better Than It Tastes", right: "Tastes Better Than It Looks" },
  { left: "Too Sweet", right: "Too Bitter" },
  { left: "Snack", right: "Meal" },
  { left: "Authentic", right: "Adapted for Mass Appeal" },
  { left: "Guilty Pleasure", right: "Virtuous Choice" },
  { left: "Messy", right: "Neat" },
  { left: "Overpriced", right: "Great Value" },
  { left: "Hangover Food", right: "Date-Night Food" },
  { left: "An Acquired Taste", right: "Instantly Likeable" },
  { left: "Too Rich", right: "Too Light" },
  { left: "Fast Food", right: "Slow Food" },
  { left: "More Sauce", right: "More Texture" },
  { left: "Weird Combo", right: "Classic Combo" },
  { left: "Home-Cooked Vibes", right: "Restaurant Vibes" },
  { left: "More Caffeine", right: "More Comfort" },
  { left: "Worth the Calories", right: "Not Worth the Calories" }
  ]
};
