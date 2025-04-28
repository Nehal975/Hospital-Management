require("mongoose").connect(process.env.DB_KEY)
    .then(() => {
        console.log("Database is connected")
    })
    .catch((error) => {
        console.log(error)
    })