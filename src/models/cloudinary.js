const cloudinary = require("cloudinary").v2

cloudinary.config({ 
    cloud_name: 'dao4e51u3', 
    api_key: api_key, 
    api_secret: secret_key
  });

module.exports = cloudinary;