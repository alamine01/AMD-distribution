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

    const cardWidth = 320;
    const scrollAmount = cardWidth * 2.5;
    
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
      
      const cardWidth = 320;
      const newIndex = Math.round(container.scrollLeft / (cardWidth * 2.5));
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

  const totalPages = Math.max(1, Math.ceil(products.length / 3));

  return (
    <section className="product-carousel-section" id={categoryId ? `category-${categoryId}` : undefined}>
      {title && (
        <div className="carousel-header">
          <div className="carousel-title-group">
            <span className="carousel-badge-line"></span>
            <h2 className="carousel-title">{title}</h2>
            <span className="carousel-count">{products.length} produit{products.length > 1 ? 's' : ''}</span>
          </div>
          <div className="carousel-indicators">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = 320;
                    const scrollAmount = cardWidth * 2.5;
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

export default ProductCarousel;
