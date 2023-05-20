const mongoose = require('mongoose');

mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("connected to online database");
  })
  .catch((e) => {
    console.log("Error: ", e);
  });
