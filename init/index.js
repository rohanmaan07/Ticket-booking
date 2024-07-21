const mongoose = require("mongoose");
const initData = require("./data.js");
const Movie = require("../models/Movies.js")

const MONGO_URL = 'mongodb://127.0.0.1:27017/booking';

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Movie.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"669786c1352398b83a35d576"}));
  await Movie.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();