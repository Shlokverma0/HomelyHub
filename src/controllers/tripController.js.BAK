// recv the users info
// validate the req info
// send the information to AI planner
// calculate budget per night
// search mongoDB for suitable properties
// send both AI trip plan + matching properties back to frontend /user

import {Property} from "../Models/propertyModel.js"
import { planTrip } from "../../AI/tripPlanner.js";
import {generateDescription} from "../../AI/generateDescription.js"

const cleanCity = (text) => text.toLowerCase().replaceAll(" ", "")

const createTripPlan = async(req,res) => {
  try {
    const {destination, budget, days, people, interests} = req.body
    if (!destination || !budget || !days || !people){
      return res.status(400).json({
        status:"fail",
        message:"Please fill in destiantion, budget, budget, days and people"
      })
    }
    const plan = await planTrip({
      destination,
      budget,
      days,
      people,
      interests : interests || []
    });

    const perNight = Number(budget) / Number(days);

    const city = cleanCity(destination);

    const properties = await Property.find({
      $or:[
        {"address.city": city},
        {"address.state": city},
        {"address.area": city}
      ],
      price:{$lte: perNight},
      maximumGuest:{$gte: Number(people)},
    }).limit(6);

    res.status(200).json({
      status: "success",
      data:{plan, properties, perNight}
    })
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message:"Could not create a trip plan, please try again"
    })
  }
}


const writeDescription = async(req, res)=>{
  try{
const description = await generateDescription(req.body);
res.status(200).json({status:"success", data:{description}})
}catch(error){
  res.status(500).json({
    status: "fail",
    message: "Could not generate a description"
  })
}
      
}
export {createTripPlan, writeDescription};