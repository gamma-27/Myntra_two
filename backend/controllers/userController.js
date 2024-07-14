const User = require('../models/User');
const Product = require('../models/Product');

const addToLikedProducts = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find the user and product by their respective IDs
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    // Create a new liked product object
    const likedProduct = {
      productId: product._id,
      brand: product.brand,
      color: product.color,
      fabric: product.fabric,
      length: product.length,
      type: product.type,
      fit: product.fit,
      mainTrend: product.mainTrend,
      pattern: product.pattern,
      product: product.product
    };

    // Add the liked product to user's likedProducts array
    user.likedProducts.push(likedProduct);

    // Save the updated user document
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error adding to liked products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addToLikedProducts };
