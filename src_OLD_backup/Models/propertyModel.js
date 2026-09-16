import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  propertyName:{
    type: String,
    required:[true, "Please enter your property name"]   
  },
  description:{
    type: String,
    required: [true,'Please add information about your property']
},
  extraInfo:{
    type: String,
    default:"checkin on time,checkout on time, good services available",
  },
  propertyType:{
    type: String,
    enum:["House", "Flat", "Guest House", "Hotel"],
    default:"House"
  },
  roomType:{
    type:String,
    enum:["Anytype", "Room", "Entire Home"],
    default:"Anytype"
  },
  maximumGuest:{
    type: Number,
    required: [true, 'Please tell the maximum number of guests']
  },
  amenities:{
type:String,
required:[true],
enum:["Wifi", "Kitchen", "wahing machine", "TV", "pool", "Free parking", "AC", "refrigerator", "complementary Tea/Coffee", "spacious rooms"],
  images:{
    type:
    [
      {
      public_id:{
        type: String
      },
      url:{
        type:String,
        required:true
          }
      }
      ],
      validate:{
        validator:function(arr){
          return arr.length>=6;
        },
        message:"The images must contain at least 6 images"
      }
          },
          price:{
            type: Number,
            required:[true, "Please enter the price per night value"],
            default:1000
          },
          address:{
            state:String,
            city: String,
            area: String,
            PINcode: Number, 
          },
         
          currentBookings:[
          {
            bookingId:{
              type: mongoose.Schema.Types.ObjectId,
              ref:"Booking"
            },
            fromDate:{
              type:Date
            },
            toDate:{
              type:Date
            },
            UserId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"User"
            }
          }
          ],
          userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          slug:String,
          checkInTime:{type:String,default:"11:00"},
          checkOutTime:{type:String,default: "13:00"}
        }
})

propertySchema.pre("save", function(next){
  this.slug = slugify(this.propertyName,{lower:true})
  next();
})

propertySchema.pre("save", function(next){
  this.slug = this.address.city.toLowerCase().replaceAll(" ", "")
  next();
})

// const Property = mongoose.model("Property", propertySchema);

const Property = mongoose.model.Property || mongoose.model("Property", propertySchema);
export{Property};