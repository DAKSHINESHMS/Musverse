// mongo db connection
import mongoose from "mongoose";
async function connect(){
    mongoose.set('strictQuery', true)
    const db = await mongoose.connect("mongodb://localhost:27017/?directConnection=true");
    if(db){
        console.log("🥳 Databse created successfully")
    }else{
        console.log("😕 Unable to create database")
    }
    return db
}
export default connect