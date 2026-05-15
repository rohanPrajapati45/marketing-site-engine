import mongoose from "mongoose";
import Section from "../Section.js";

const StatSchema =
  new mongoose.Schema(
    {
      sectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true
      },
      cards:[
        {
            title:{
                type:String,
                required:true,
            },
            number:{
                type:Number,
                required:true,
            },
            lines:[{
                type:String,
                required:true,
            }]
            ,
            order:{
              type:Number,
              required:true,
            },

            active:{
              type:Boolean,
              default:true,
            }
        }
      ]
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "StatCard",
  StatSchema
);