const Product = require('../models/Product');

// Function to insert products into the database
const insertProducts = async () => {
  try {
    const products=[
      {
        "brand": "Brand A",
        "color": "White",
        "fabric": "Cotton",
        "length": "Full",
        "type": "Kurta Set",
        "fit": "Regular",
        "mainTrend": "Ethnic",
        "pattern": "Embroidered",
        "product": "Embroidered Kurta Set",
        "imageUrl": "https://d2x02matzb08hy.cloudfront.net/img/clothing/hero_image/781215971/TWS_White_Primary.jpg",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand B",
        "color": "Multicolor",
        "fabric": "Rayon",
        "length": "Ankle-Length",
        "type": "Kurta Set",
        "fit": "Regular",
        "mainTrend": "Ethnic",
        "pattern": "Printed",
        "product": "Printed Palazzo Set",
        "imageUrl": "https://d2x02matzb08hy.cloudfront.net/img/project_photo/image/10222160/44876/Untitled_design__41_.jpg",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand C",
        "color": "Cream",
        "fabric": "Polyester",
        "length": "Knee-Length",
        "type": "Dress",
        "fit": "A-line",
        "mainTrend": "Casual",
        "pattern": "Solid",
        "product": "A-line Dress",
        "imageUrl": "http://media.uwdress.com/media/catalog/product/21077/cream/r11_1.jpg",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand D",
        "color": "Olive",
        "fabric": "Chiffon",
        "length": "Mini",
        "type": "Dress",
        "fit": "Shift",
        "mainTrend": "Bohemian",
        "pattern": "Braided",
        "product": "Shift Dress",
        "imageUrl": "https://cdn.tobi.com/product_images/md/1/olive-adaline-braided-shift-dress.jpg",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand E",
        "color": "Black",
        "fabric": "Cotton Blend",
        "length": "Full",
        "type": "Trousers",
        "fit": "Slim",
        "mainTrend": "Formal",
        "pattern": "Solid",
        "product": "Slim Fit Trousers",
        "imageUrl": "https://img.freepik.com/free-photo/woman-posing_1303-3732.jpg?t=st=1720792336~exp=1720795936~hmac=dafd8402cc769354aaef1869c804ce24d6fc0003d31a4bf98c5ff2d5560db5af&w=360",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand F",
        "color": "Blue",
        "fabric": "Denim",
        "length": "Full",
        "type": "Jeans",
        "fit": "Bootcut",
        "mainTrend": "Casual",
        "pattern": "Solid",
        "product": "Bootcut Jeans",
        "imageUrl": "https://www.trilogystores.co.uk/cdn-cgi/image/fit=contain,f=auto,quality=80/Content/Images/EditorImages/blogimages%2Fhow%20to%20style%20bootcut%20jeans%2Fnew%2F06.jpg",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand G",
        "color": "Red",
        "fabric": "Cotton",
        "length": "Waist-Length",
        "type": "T-shirt",
        "fit": "Regular",
        "mainTrend": "Graphic",
        "pattern": "Printed",
        "product": "Printed T-shirt",
        "imageUrl": "https://img.freepik.com/free-photo/portrait-tired-young-woman-relaxing-dance-studio_23-2148169425.jpg?t=st=1720792646~exp=1720796246~hmac=d6ebdaf08ce6ead2ea41836eee84772591730edc99ab5371c3f8c7caa52b2434&w=360",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand H",
        "color": "Navy",
        "fabric": "Cotton Blend",
        "length": "Waist-Length",
        "type": "Polo Shirt",
        "fit": "Regular",
        "mainTrend": "Casual",
        "pattern": "Solid",
        "product": "Polo Shirt",
        "imageUrl": "https://img.freepik.com/free-photo/handsome-man-posing_144627-18967.jpg?t=st=1720792034~exp=1720795634~hmac=f39f14fcadc7e71bb479e45a44988604323a78040c8a3f5c829fcf3dc6672a67&w=360",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand I",
        "color": "Gold",
        "fabric": "Leather",
        "length": "Small",
        "type": "Handbag",
        "fit": "N/A",
        "mainTrend": "Party",
        "pattern": "Solid",
        "product": "Clutch",
        "imageUrl": "https://img.freepik.com/free-photo/woman-with-bag_1303-12943.jpg?t=st=1720792795~exp=1720796395~hmac=8b780b558c07ff229088308b11ebdff6e35d67af0e1b464f5bc181907e0533e6&w=360",
        "likes": 0,
        "likedBy": []
      },
      {
        "brand": "Brand J",
        "color": "Brown",
        "fabric": "Leather",
        "length": "Medium",
        "type": "Handbag",
        "fit": "N/A",
        "mainTrend": "Casual",
        "pattern": "Solid",
        "product": "Backpack",
        "imageUrl": "https://img.freepik.com/free-photo/business-woman-with-mobile-phone_158595-926.jpg?t=st=1720792867~exp=1720796467~hmac=8ad855ee0e304cf27f6272835ac92d39f9340124863d3ba1a689cae2deb868b8&w=360",
        "likes": 0,
        "likedBy": []
      }
    ]
    

    const insertedProducts = await Product.insertMany(products);
    console.log('Products inserted successfully!');
    
    return insertedProducts; // Return inserted products or IDs
  } catch (error) {
    console.error('Error inserting products:', error);
    throw error; // Re-throw error for handling in caller function
  }
};

// Controller function to update like count for a product
const updateLikes = async (req, res) => {
  const productId = req.params.productId;
  const action = req.body.action; // 'like' or 'unlike'
  const userId = req.body.userId; // Ensure userId is passed in the request body

  try {
    // Find the product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update like count based on action
    if (action === 'like') {
      // Check if userId is provided and not already in likedBy array
      if (userId && !product.likedBy.includes(userId)) {
        product.likedBy.push(userId); // Add userId to likedBy array
      }
      product.likes += 1;
    } else if (action === 'unlike') {
      if (product.likes > 0) {
        // Remove userId from likedBy array if it exists
        if (userId) {
          product.likedBy = product.likedBy.filter(id => id !== userId);
        }
        product.likes -= 1;
      } else {
        return res.status(400).json({ message: 'Cannot unlike, likes are already 0' });
      }
    }

    // Save updated product to database
    const updatedProduct = await product.save();

    // Return updated product or success message
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { insertProducts, updateLikes };