const mongoose = require("mongoose");

const movies = [
    {
        title: "M.S. Dhoni: The Untold Story",
        description: "M.S. Dhoni: The Untold Story is a 2016 Indian Hindi-language biographical sports drama film directed and co-written by Neeraj Pandey. It is based on the life of former Test, ODI and T20I captain of the Indian national cricket team, Mahendra Singh Dhoni. The film stars the late Sushant Singh Rajput as MS Dhoni, along with Disha Patani, Kiara Advani, and Anupam Kher. The film chronicles the life of Dhoni from a young age through a series of life events.",
        actors: "Sushant Singh Rajput, Kiara Advani",
        url:{
            
            url: "https://images.unsplash.com/photo-1720423413643-363310b689e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
            filename:"urlImage",
        } ,
        releaseDate: "2016-09-30",
        price: 150,
        owner: new mongoose.Types.ObjectId() // Placeholder for an actual user ID
    },
    {
        title: "M.S. Dhoni: The Untold Story",
        description: "M.S. Dhoni: The Untold Story is a 2016 Indian Hindi-language biographical sports drama film directed and co-written by Neeraj Pandey. It is based on the life of former Test, ODI and T20I captain of the Indian national cricket team, Mahendra Singh Dhoni. The film stars the late Sushant Singh Rajput as MS Dhoni, along with Disha Patani, Kiara Advani, and Anupam Kher. The film chronicles the life of Dhoni from a young age through a series of life events.",
        actors: "Sushant Singh Rajput, Kiara Advani",
        url:{
           
            url: "https://images.unsplash.com/photo-1720423413643-363310b689e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
            filename:"urlImage",
        } ,
        releaseDate: "2016-09-30",
        price: 150,
        owner: new mongoose.Types.ObjectId() // Placeholder for an actual user ID
    }
];

module.exports = { data: movies };
