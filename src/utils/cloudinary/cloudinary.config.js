import { v2 as cloudinary } from 'cloudinary';



    cloudinary.config({ 
        cloud_name: process.env.CLOUDNAME, 
        api_key: process.env.APIKEY, 
        api_secret: process.env.API_SECRET 
    });
    export default cloudinary;