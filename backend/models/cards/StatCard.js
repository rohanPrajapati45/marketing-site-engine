import mongoose from "mongoose";
import Section from "../Section";

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
            label:{
                type:String,
                required:true,
            },
            NaNumbers:{
                type:Number,
                required:true,
            },
            description:{
                type:String,
                required:true,
            }
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