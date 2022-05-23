import React, { useContext, useEffect } from 'react';
import NutritionTotals from './NutritionTotals';
import FoodList from './FoodList';
import { FoodsContext, MetricsContext, MacrosContext } from '../UserContext';
import Graph from './Graph';
import { NT_API_URL } from '../apiConfig';
import axios from 'axios';

export default function Home({ loggedIn, userInfo, getUserFoods })
{
  const { userFoods, setUserFoods } = useContext(FoodsContext);
  const { userMetrics } = useContext(MetricsContext);
  const { userMacros } = useContext(MacrosContext);

  // tracks data to render.
  const totals =
  {
    "calories": 0,
    "fats": 0,
    "carbs": 0,
    "proteins": 0
  }

  // updates totals object.
  userFoods.forEach((food) => 
  {
    totals.calories += food.calories;
    totals.fats += food.fat_total_g;
    totals.carbs += food.carbohydrates_total_g;
    totals.proteins += food.protein_g;
  })

  function deleteFood(foodId)
  {
    axios.delete(NT_API_URL + `foods/${foodId}`,
      {
        headers:
        {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => 
      {
        if (response.status === 204)
        {
          setUserFoods((prevState) =>
          {
            return prevState.filter((food) => food._id !== foodId);
          });
        }
      });
  }

  useEffect(() =>
  {
    getUserFoods();
  }, [])

  console.log(userFoods);

  if (!loggedIn && !userInfo)
  {
    return (
      <div className="home-container">
        <h2>The first step is diet!</h2>
        <h2>Keep track of foods and their nutrients throughout the day!</h2>
        <img src="https://cdn.pixabay.com/photo/2019/10/18/14/58/remove-4559331_960_720.jpg" alt="first step" />
      </div>
    )
  }

  return (
    <div className="home-container">
      <h2>Nutrition Summary</h2>
      <div className="summary-container">
        <NutritionTotals totals={totals} userMetrics={userMetrics} userMacros={userMacros} />
        <Graph className="graph" />
      </div>
      <FoodList userFoods={userFoods} deleteFood={deleteFood} />
      {!userFoods.length && <p className="list-tip">Search for foods/meals to add to this list...</p>}
    </div>
  )
}