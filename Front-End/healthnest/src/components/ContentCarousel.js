import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ContentCarousel = ({ items, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const itemsPerPage = 3;
  const autoScrollInterval = 3000;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= items.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? items.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    let interval;
    if (!isHovered) {
      interval = setInterval(nextSlide, autoScrollInterval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHovered, items.length]);

  const getVisibleItems = () => {
    const visibleItems = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % items.length;
      visibleItems.push(items[index]);
    }
    return visibleItems;
  };

  return (
    <div 
      className="position-relative p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        margin: '20px', // Add margin around the carousel
        borderRadius: '15px', // Optional: Add rounded corners
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: Background color for the carousel container
      }}
    >
      <button className="carousel-arrow left" onClick={prevSlide}>
        &#8249; {/* Left arrow symbol */}
      </button>
      
      <div className="row g-4">
        {getVisibleItems().map((item, index) => (
          <motion.div
            key={`${item.id}-${currentIndex}-${index}`}
            className="col-md-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {type === 'tips' ? (
              <motion.div 
                className="card h-100 shadow-sm border-0"
                whileHover={{ scale: 1.02 }}
                style={{ 
                  backgroundColor: item.color, 
                  margin: '15px', // Gap around each item
                  padding: '20px' // Internal padding for each item
                }}
              >
                <div className="card-body p-4">
                  <div className="text-center mb-3" style={{ fontSize: '2rem' }}>
                    {item.icon}
                  </div>
                  <p className="card-text text-center fw-medium">{item.tip}</p>
                </div>
              </motion.div>
            ) : type === 'news' ? (
              <div className="card h-100 shadow-sm border-0" style={{ margin: '15px', padding: '20px' }}>
                <div className="position-relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="card-img-top"
                    style={{ 
                      height: "200px", 
                      objectFit: "cover",
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25" />
                </div>
                <div className="card-body">
                  <small className="text-muted">{item.date}</small>
                  <h5 className="card-title mt-2">{item.title}</h5>
                  <p className="card-text">{item.excerpt}</p>
                  <button className="btn btn-link p-0 text-primary">
                    Read More <FaChevronRight className="ms-1" />
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>

      <button className="carousel-arrow left" onClick={prevSlide}>
        &#8249; {/* Left arrow symbol */}
      </button>
      <button className="carousel-arrow right" onClick={nextSlide}>
        &#8250; {/* Right arrow symbol */}
      </button>

      <div className="d-flex justify-content-center mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            className="btn btn-sm mx-1 rounded-circle"
            style={{
              width: '10px',
              height: '10px',
              padding: 0,
              backgroundColor: currentIndex === index ? '#fdf6ee' : '#fdf6ee',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentCarousel;
