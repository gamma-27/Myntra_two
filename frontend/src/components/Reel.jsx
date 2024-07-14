
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Reel.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Reel() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSimilarProducts, setTopSimilarProducts] = useState([]);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
    }

    const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || {};
    const initialLikes = products.map(product => likedProducts[product._id]);
    setLikes(initialLikes);
  }, [products]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
        const initialLikeCounts = response.data.map(product => product.likes);
        setLikeCounts(initialLikeCounts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handleDoubleClick = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    const productId = products[currentIndex]._id;

    axios.put(`http://localhost:5000/api/products/${productId}/likes`, { action: 'like', userId })
      .then(response => {
        const updatedProduct = response.data;

        const newLikes = [...likes];
        newLikes[currentIndex] = true;
        setLikes(newLikes);

        const newLikeCounts = [...likeCounts];
        newLikeCounts[currentIndex] = updatedProduct.likes;
        setLikeCounts(newLikeCounts);

        const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || {};
        likedProducts[productId] = true;
        localStorage.setItem('likedProducts', JSON.stringify(likedProducts));

        toast.success('You have liked this product!');

        axios.put(`http://localhost:5000/api/users/${userId}/liked-products/${productId}`)
          .then(userResponse => {
            // Handle success if needed
          })
          .catch(userError => {
            console.error('Error adding product to user\'s liked products:', userError);
            toast.error('Failed to add product to user\'s liked products');
          });

        // Reset top similar products after a like
        setTopSimilarProducts([]);
      })
      .catch(error => {
        console.error('Error updating like count:', error);
        toast.error('Failed to update like count');
      });
  };

  const computeCosineSimilarity = (vecA, vecB) => {
    if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
      return 0;
    }
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * (vecB[idx] || 0), 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
  };

  const similarityMatrix = products.map((productA) =>
    products.map((productB) =>
      computeCosineSimilarity(productA.features, productB.features)
    )
  );

  const getRecommendedProduct = useCallback((currentIndex, likedProducts, similarityMatrix) => {
    if (topSimilarProducts.length > 0) {
      return topSimilarProducts.shift();
    }

    const likedProductIndices = products.reduce((indices, product, idx) => {
      if (likedProducts[product._id]) {
        indices.push(idx);
      }
      return indices;
    }, []);

    const cumulativeSimilarities = products.map((_, idx) => {
      return likedProductIndices.reduce((sum, likedIdx) => {
        return sum + similarityMatrix[likedIdx][idx];
      }, 0);
    });

    const filteredSimilarities = cumulativeSimilarities.map((similarity, idx) => 
      likedProducts[products[idx]._id] ? -1 : similarity
    );

    const sortedIndices = filteredSimilarities
      .map((similarity, idx) => ({ similarity, idx }))
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ idx }) => idx)
      .slice(0, 5);

    setTopSimilarProducts(sortedIndices.slice(1));
    return sortedIndices[0] !== -1 ? sortedIndices[0] : (currentIndex + 1) % products.length;
  }, [products, similarityMatrix, topSimilarProducts]);

  const handleWheel = useCallback((event) => {
    if (scrolling) return;
    setScrolling(true);

    setTimeout(() => {
      setScrolling(false);
    }, 500); // Adjust delay as needed to prevent rapid scrolling

    if (event.deltaY > 0) {
      // Scrolled downwards, move to the next product
      // Get recommended product if scrolled to the end and user has liked at least one product
      if (likes.some(liked => liked)) {
        const nextRecommended = getRecommendedProduct(currentIndex, JSON.parse(localStorage.getItem('likedProducts')) || {}, similarityMatrix);
        setCurrentIndex(nextRecommended);
      }else{
        const nextIndex = (currentIndex + 1) % products.length;
        setCurrentIndex(nextIndex);
      }
    } else if (event.deltaY < 0) {
      // Scrolled upwards, move to the previous product
      const nextIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, products.length, scrolling, getRecommendedProduct, similarityMatrix, likes]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  const handleMouseMove = () => {
    setScrolling(false);
  };

  // Define currentProduct based on currentIndex and products array
  const currentProduct = products[currentIndex];

  if (!currentProduct) {
    return <div>Loading...</div>; // or handle the loading state as per your design
  }

  return (
    <div className="" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/fast-fashion-vs-slow-sustainable-fashion_23-2149133987.jpg?t=st=1720633085~exp=1720636685~hmac=d7b69771dbb039dc1054f82bbd2e2a2da5442d4fcc98acac5270a889ffe092c6&w=360')" }} onMouseMove={handleMouseMove}>
      <div className="flex justify-center items-center">
        <div className="relative w-72 h-[27rem] flex justify-center items-center overflow-hidden border-4 border-gold-500 rounded-lg shadow-md">
          <div className="" onDoubleClick={handleDoubleClick}>
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.product}
              className={`outfit-image ${likes[currentIndex] ? 'liked' : ''}`}
            />
            <div className="absolute bottom-8 right-4 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex-col">
                <div className='ml-4'>
                  <span
                    role="img"
                    aria-label=""
                    className={`heart ${likes[currentIndex] ? 'active' : ''}`}
                  >
                    {likes[currentIndex] ? '❤️' : '🤍'}
                  </span>
                  <div className="ml-[0.7rem] text-white">{likeCounts[currentIndex]}</div>
                </div>
              </div>

              <div className="text-2xl text-gray-800 mt-2 ml-4">
                💬
                <div className="mt-2 ml-2 font-normal text-white text-sm">101</div>
              </div>
              <div className="text-2xl text-gray-800 mt-4 ml-4">
                🛍️
                <div className="mt-2 ml-2 font-normal text-white text-sm">38</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reel;
