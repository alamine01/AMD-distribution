import { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

function ProductCarousel({ title, products, onOrderClick, categoryId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320; // Largeur approximative d'une carte + gap
    const scrollAmount = cardWidth * 3; // Scroll de 3 cartes à la fois
    
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 10);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
      );
      
      // Mettre à jour l'index actuel basé sur la position de scroll
      const cardWidth = 320;
      const newIndex = Math.round(container.scrollLeft / (cardWidth * 3));
      setCurrentIndex(newIndex);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    
    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="product-carousel-section">
      {title && (
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
          <div className="carousel-indicators">
            {Array.from({ length: Math.ceil(products.length / 3) }).map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = 320;
                    const scrollAmount = cardWidth * 3;
                    container.scrollTo({
                      left: index * scrollAmount,
                      behavior: 'smooth'
                    });
                    setCurrentIndex(index);
                  }
                }}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="carousel-container">
        {canScrollLeft && (
          <button
            className="carousel-button carousel-button-left"
            onClick={() => scroll('left')}
            aria-label="Précédent"
          >
            ‹
          </button>
        )}

        <div className="carousel-wrapper" ref={scrollContainerRef}>
          <div className="carousel-content">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOrderClick={onOrderClick}
              />
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            className="carousel-button carousel-button-right"
            onClick={() => scroll('right')}
            aria-label="Suivant"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}

export default ProductCarousel;
