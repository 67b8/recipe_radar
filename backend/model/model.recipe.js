

const mongoose = require('mongoose');




//recipeSchema
const recipeSchema = new mongoose.Schema({
    name:String,
    ingredients: [{                       //Array of strings
        type: String
    }],
    instructions: {                       //markdown format
        type: String
    },
    cuisine:String,
    difficulty:String,                   //easy medium hard
    image: {                             //String(url)
        type: String,
        default: null
    },
    likes:{
        type:Number,
        default:0},
    averageRating:{
        type:Number,
        default:0}
        ,   
    Rating:[
        {
            type:Number
        }
    ],
                //calculated based on user rating
    comments:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        },
        comment:{
            type:String,
        },
        timeStamp:{
            type:Date,
            default:Date.now
        }
    }]
});

const recipeModel = mongoose.model('Recipe', recipeSchema);


module.exports=recipeModel;