import { useState} from 'react';

import { FaChevronRight } from 'react-icons/fa';

const ContentCarousel = ({ items, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setIsHovered] = useState(false); // eslint-disable-line no-unused-vars

  const itemsPerPage = 3;

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
        margin: '20px', 
        borderRadius: '15px', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
      }}
    >
      <button className="carousel-arrow left" onClick={prevSlide}>
        &#8249; {}
      </button>
      
      <div className="row g-4">
        {getVisibleItems().map((item, index) => (
          <div
            key={`${item.id}-${currentIndex}-${index}`}
            className="col-md-4"
          >
            {type === 'tips' ? (
              <div 
                className="card h-100 shadow-sm border-0"
                style={{ 
                  backgroundColor: item.color, 
                  margin: '15px', 
                  padding: '20px' 
                }}
              >
                <div className="card-body p-4">
                  <div className="text-center mb-3" style={{ fontSize: '2rem' }}>
                    {item.icon}
                  </div>
                  <p className="card-text text-center fw-medium">{item.tip}</p>
                </div>
              </div>
            ) : type === 'news' ? (
              <div className="card h-100 shadow-sm border-0" style={{ margin: '15px', padding: '20px' }}>
                <div className="position-relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="card-img-top"
                    style={{ 
                      height: "200px", 
                      objectFit: "cover"
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
          </div>
        ))}
      </div>

      <button className="carousel-arrow left" onClick={prevSlide}>
        &#8249; {}
      </button>
      <button className="carousel-arrow right" onClick={nextSlide}>
        &#8250; {}
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
              border: 'none'
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentCarousel;
