// get all properties
// get property based on ids
import { EventEmitterAsyncResource } from "events";
import {Property} from "../Models/propertyModel.js";
import {APIFeatures} from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js"; 

const getProperties = async(req, res)=>{
  try{
    const features = new APIFeatures(Property.find(), req.query)
    .filter()
    .search()
    .paginate();

    const allProperties = await Property.find();
    const doc =await features.query;
    res.status(200).json({
      status: "success",
      no_of_responses: doc.length,
      data: doc
    })
  }
  catch(error){
    console.error("Error searching properties: ", error)
    res.status(500).json({error: "Internal server Error"})
  }
}

//get property by user id
//http://localhost:8080/api/v1/rent/listing:id
//req.params.id


const getProperty = async(req, res) => {
try{
  const property = await Property.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: property,
  })
}
catch(error){
res.status(404).json({
  status: "fail",
  message: error.message
})
}
}

export{
  getProperties,
  getProperty
}