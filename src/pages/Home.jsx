import { useState, useEffect } from 'react';
import { productsStorage, categoriesStorage } from '../utils/localStorage';
import { db } from '../firebase/config';
import { collection, getDocs, onSnapshot, doc } from 'firebase/firestore';
import Footer from '../components/Footer';
import ProductCarousel from '../components/ProductCarousel';
import Cart from '../components/Cart';
import { CONTACT_CONFIG } from '../config/contact';
import './Home.css';

// Mode développement : utiliser localStorage au lieu de Firebase
const USE_LOCAL_STORAGE = false;

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  // Catégories de prévisualisation
  const previewCategories = [
    { id: 'cat1', name: 'Électronique', icon: '📱' },
    { id: 'cat2', name: 'Mode & Vêtements', icon: '👕' },
    { id: 'cat3', name: 'Maison & Déco', icon: '🏠' },
    { id: 'cat4', name: 'Beauté & Santé', icon: '💄' },
    { id: 'cat5', name: 'Sport & Fitness', icon: '⚽' }
  ];

  // Produits de prévisualisation avec images réelles
  const previewProducts = [
    // Électronique
    { id: '1', name: 'Smartphone Premium', description: 'Smartphone haute performance avec écran AMOLED 6.7 pouces', price: 254000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', categoryId: 'cat1', stock: 15 },
    { id: '2', name: 'Écouteurs Sans Fil', description: 'Écouteurs Bluetooth avec réduction de bruit active', price: 89000, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', categoryId: 'cat1', stock: 25 },
    { id: '3', name: 'Tablette Pro', description: 'Tablette 10 pouces avec processeur puissant', price: 189000, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', categoryId: 'cat1', stock: 8 },
    { id: '4', name: 'Montre Connectée', description: 'Montre intelligente avec suivi de santé', price: 65000, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', categoryId: 'cat1', stock: 30 },
    { id: '5', name: 'Enceinte Portable', description: 'Enceinte Bluetooth avec son stéréo puissant', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', categoryId: 'cat1', stock: 12 },
    
    // Mode & Vêtements
    { id: '6', name: 'T-Shirt Premium', description: 'T-shirt en coton bio, coupe moderne', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', categoryId: 'cat2', stock: 50 },
    { id: '7', name: 'Jean Slim Fit', description: 'Jean délavé, coupe ajustée', price: 25000, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', categoryId: 'cat2', stock: 20 },
    { id: '8', name: 'Veste en Cuir', description: 'Veste en cuir véritable, style classique', price: 125000, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', categoryId: 'cat2', stock: 5 },
    { id: '9', name: 'Sneakers Sport', description: 'Chaussures de sport confortables', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', categoryId: 'cat2', stock: 18 },
    { id: '10', name: 'Robe Élégante', description: 'Robe cocktail, coupe ajustée', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', categoryId: 'cat2', stock: 22 },
    
    // Maison & Déco
    { id: '11', name: 'Lampadaire Moderne', description: 'Lampadaire design avec éclairage LED', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', categoryId: 'cat3', stock: 10 },
    { id: '12', name: 'Coussin Décoratif', description: 'Coussin en velours, plusieurs coloris', price: 12000, imageUrl: 'https://images.unsplash.com/photo-1584100936595-4556d5b8e5e0?w=400&h=400&fit=crop', categoryId: 'cat3', stock: 35 },
    { id: '13', name: 'Tapis Moderne', description: 'Tapis en laine, design contemporain', price: 75000, imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400&h=400&fit=crop', categoryId: 'cat3', stock: 7 },
    { id: '14', name: 'Vase Décoratif', description: 'Vase en céramique, design unique', price: 28000, imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', categoryId: 'cat3', stock: 28 },
    { id: '15', name: 'Miroir Design', description: 'Miroir mural avec cadre doré', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea8?w=400&h=400&fit=crop', categoryId: 'cat3', stock: 14 },
    
    // Beauté & Santé
    { id: '16', name: 'Kit Soin Visage', description: 'Kit complet de soin pour le visage', price: 32000, imageUrl: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop', categoryId: 'cat4', stock: 40 },
    { id: '17', name: 'Parfum Premium', description: 'Parfum de luxe, senteur boisée', price: 85000, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', categoryId: 'cat4', stock: 6 },
    { id: '18', name: 'Rouge à Lèvres', description: 'Rouge à lèvres longue tenue', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1583241805004-265fc0e91459?w=400&h=400&fit=crop', categoryId: 'cat4', stock: 45 },
    { id: '19', name: 'Crème Hydratante', description: 'Crème hydratante jour et nuit', price: 22000, imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', categoryId: 'cat4', stock: 32 },
    
    // Sport & Fitness
    { id: '20', name: 'Haltères Ajustables', description: 'Haltères réglables de 2 à 20 kg', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', categoryId: 'cat5', stock: 16 },
    { id: '21', name: 'Tapis de Yoga', description: 'Tapis de yoga antidérapant', price: 18000, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', categoryId: 'cat5', stock: 0 },
    { id: '22', name: 'Vélo d\'Appartement', description: 'Vélo d\'appartement pliable', price: 125000, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', categoryId: 'cat5', stock: 3 }
  ];

  const previewFeatures = [
    { icon: '🚚', title: 'Livraison Rapide', description: 'Livraison sous 24h' },
    { icon: '💳', title: 'Paiement Sécurisé', description: 'Transactions sécurisées' },
    { icon: '🎁', title: 'Offres Spéciales', description: 'Promotions régulières' }
  ];

  const fetchProducts = async () => {
    if (USE_LOCAL_STORAGE) {
      const productsList = productsStorage.getAll();
      setProducts(productsList.length > 0 ? productsList : previewProducts);
      setLoading(false);
    } else {
      // Mode Firebase
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList.length > 0 ? productsList : previewProducts);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setProducts(previewProducts);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCategories = async () => {
    if (USE_LOCAL_STORAGE) {
      const categoriesList = categoriesStorage.getAll();
      setCategories(categoriesList.length > 0 ? categoriesList : previewCategories);
    } else {
      // Mode Firebase
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesList.length > 0 ? categoriesList : previewCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories(previewCategories);
      }
    }
  };

  useEffect(() => {
    if (USE_LOCAL_STORAGE) {
      fetchProducts();
      fetchCategories();
      
      // Écouter les changements dans localStorage pour mettre à jour automatiquement
      const handleStorageChange = () => {
        fetchProducts();
        fetchCategories();
      };
      
      // Écouter les événements de changement de localStorage
      window.addEventListener('storage', handleStorageChange);
      
      // Vérifier périodiquement les changements (pour les changements dans le même onglet)
      const interval = setInterval(() => {
        fetchProducts();
        fetchCategories();
      }, 2000); // Vérifier toutes les 2 secondes
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    } else {
      // Mode Firebase - Écouter les changements en temps réel
      const unsubscribeProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const productsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(productsList.length > 0 ? productsList : previewProducts);
          setLoading(false);
        },
        (error) => {
          console.error('Erreur lors du chargement des produits:', error);
          setProducts(previewProducts);
          setLoading(false);
        }
      );

      const unsubscribeCategories = onSnapshot(
        collection(db, 'categories'),
        (snapshot) => {
          const categoriesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCategories(categoriesList.length > 0 ? categoriesList : previewCategories);
        },
        (error) => {
          console.error('Erreur lors du chargement des catégories:', error);
          setCategories(previewCategories);
        }
      );

      // Charger les paramètres du site en temps réel
      const unsubscribeSettings = onSnapshot(
        doc(db, 'settings', 'site'),
        (settingsDoc) => {
          if (settingsDoc.exists()) {
            const settingsData = settingsDoc.data();
            console.log('Paramètres mis à jour:', settingsData);
            setSettings(settingsData);
          }
        },
        (error) => {
          console.error('Erreur lors du chargement des paramètres:', error);
        }
      );

      return () => {
        unsubscribeProducts();
        unsubscribeCategories();
        unsubscribeSettings();
      };
    }
  }, []);

  // Mettre à jour le favicon quand le logo change
  useEffect(() => {
    if (settings?.logoUrl) {
      // Trouver ou créer le lien favicon
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.logoUrl;
      
      // Mettre à jour aussi apple-touch-icon pour iOS
      let appleLink = document.querySelector("link[rel~='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.getElementsByTagName('head')[0].appendChild(appleLink);
      }
      appleLink.href = settings.logoUrl;
    }
  }, [settings?.logoUrl]);

  const displayProducts = products.length > 0 ? products : previewProducts;
  const displayCategories = categories.length > 0 ? categories : previewCategories;

  // Grouper les produits par catégorie
  const productsByCategory = displayCategories.reduce((acc, category) => {
    const categoryProducts = displayProducts.filter(
      product => product.categoryId === category.id
    );
    if (categoryProducts.length > 0) {
      acc[category.id] = categoryProducts;
    }
    return acc;
  }, {});

  // Produits sans catégorie
  const productsWithoutCategory = displayProducts.filter(
    product => !product.categoryId || !displayCategories.find(cat => cat.id === product.categoryId)
  );
  if (productsWithoutCategory.length > 0) {
    productsByCategory['uncategorized'] = productsWithoutCategory;
  }

  // Filtrer par catégorie sélectionnée
  const filteredProductsByCategory = selectedCategory === 'all'
    ? productsByCategory
    : Object.keys(productsByCategory).reduce((acc, categoryId) => {
        if (categoryId === selectedCategory && productsByCategory[categoryId].length > 0) {
          acc[categoryId] = productsByCategory[categoryId];
        }
        return acc;
      }, {});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const handleOrderClick = (product) => {
    // Créer le message WhatsApp pour un produit unique
    const message = `Bonjour, je souhaite commander :\n\n`;
    const productMessage = `• ${product.name}\n`;
    const quantityMessage = `  Quantité: x1\n`;
    const priceMessage = `  Prix: ${formatPrice(product.price || 0)}\n\n`;
    const totalMessage = `*Total : ${formatPrice(product.price || 0)}*`;
    
    const fullMessage = message + productMessage + quantityMessage + priceMessage + totalMessage;
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    const message = encodeURIComponent('Bonjour, je souhaite en savoir plus sur la qualité premium de vos produits.');
    const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    const message = encodeURIComponent('Bonjour, je souhaite vous contacter pour une question ou un besoin spécifique.');
    const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };


  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            {settings?.logoUrl ? (
              <img 
                key={settings.logoUrl} 
                src={settings.logoUrl} 
                alt="AMD Distribution" 
                className="logo-image" 
                style={{ maxHeight: '50px', maxWidth: '150px', objectFit: 'contain' }} 
              />
            ) : (
              <div className="logo-icon">AMD</div>
            )}
          </div>
          <div className="header-actions">
            <Cart />
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                {settings?.heroTitle ? (
                  settings.heroTitle.split('\n').map((line, index, array) => (
                    <span key={index}>
                      {line}
                      {index < array.length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <>
                    ALL BEAUTIFUL<br />
                    COLLECTION
                  </>
                )}
              </h1>
              <div className="hero-discount">
                {settings?.heroDiscount ? (
                  (() => {
                    // Séparer le pourcentage du reste du texte
                    const match = settings.heroDiscount.match(/(\d+%)\s*(.*)/);
                    if (match) {
                      return (
                        <>
                          <span className="discount-amount">{match[1]}</span>
                          {match[2] && <span className="discount-text">{match[2]}</span>}
                        </>
                      );
                    }
                    // Si pas de format attendu, afficher tel quel
                    return <span className="discount-text">{settings.heroDiscount}</span>;
                  })()
                ) : (
                  <>
                    <span className="discount-amount">50%</span>
                    <span className="discount-text">DE RÉDUCTION</span>
                  </>
                )}
              </div>
              <button 
                className="shop-now-btn"
                onClick={() => {
                  const categorySection = document.querySelector('.category-filter-container');
                  if (categorySection) {
                    categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Acheter maintenant
              </button>
            </div>
            <div className="hero-image">
              <div className="hero-cover-image">
                <img src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"} alt="AMD Distribution - Boutique moderne" />
              </div>
            </div>
          </div>
        </section>

        {/* Barre de catégories après le hero */}
        <div className="category-filter-container">
          <div className="category-filter-nav">
            <button
              className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Tous
            </button>
            {displayCategories.map(category => (
              <button
                key={category.id}
                className={`category-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Affichage des produits par catégorie en carousels */}
        {Object.keys(filteredProductsByCategory).map(categoryId => {
          const categoryProducts = filteredProductsByCategory[categoryId];
          if (!categoryProducts || categoryProducts.length === 0) return null;
          
          const category = displayCategories.find(cat => cat.id === categoryId) || { name: 'Autres produits' };
          
          return (
            <ProductCarousel
              key={categoryId}
              title={category.name}
              products={categoryProducts}
              onOrderClick={handleOrderClick}
              categoryId={categoryId}
            />
          );
        })}

        <section className="content-section">
          <h2 className="content-title">Pourquoi Choisir AMD Distribution ?</h2>
          <p className="content-subtitle">Votre partenaire de confiance pour tous vos besoins</p>
        </section>

        <section className="two-column-section">
          <div className="column-left">
            <div className="content-item">
              <div className="content-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#2563eb" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="content-text">
                <h3 className="content-item-title">Qualité Premium</h3>
                <p className="content-item-description">Nous sélectionnons uniquement les meilleurs produits pour vous garantir satisfaction et durabilité.</p>
                <a href="#" className="content-link" onClick={handleLearnMoreClick}>En savoir plus →</a>
              </div>
            </div>
            <div className="content-item">
              <div className="content-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 21V19C21.9993 17.9352 21.6277 16.8693 20.9265 16.0001C20.2253 15.1309 19.2418 14.5107 18.13 14.25" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55219C18.7122 5.25367 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75634 18.1676 9.45782C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="content-text">
                <h3 className="content-item-title">Service Client Exceptionnel</h3>
                <p className="content-item-description">Notre équipe est à votre écoute pour répondre à toutes vos questions et besoins.</p>
                <a href="#" className="content-link" onClick={handleContactClick}>Nous contacter →</a>
              </div>
            </div>
          </div>
          <div className="column-right">
            <div className="content-image large">
              <img src={settings?.whyChooseImageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"} alt="Boutique moderne" />
            </div>
          </div>
        </section>

        <section className="numbered-section">
          <div className="numbered-header">
            <h2 className="numbered-title">Comment ça marche ?</h2>
            <p className="numbered-subtitle">Un processus simple en 3 étapes</p>
          </div>
          <div className="numbered-content">
            <div className="numbered-list">
              <div className="numbered-item">
                <span className="number">01.</span>
                <div className="numbered-text">
                  <h3 className="numbered-item-title">Parcourez notre catalogue</h3>
                  <p className="numbered-item-description">Découvrez notre large sélection de produits de qualité dans différentes catégories.</p>
                </div>
              </div>
              <div className="numbered-item">
                <span className="number">02.</span>
                <div className="numbered-text">
                  <h3 className="numbered-item-title">Commandez sur WhatsApp</h3>
                  <p className="numbered-item-description">Ajoutez vos produits au panier et commandez directement via WhatsApp en un clic.</p>
                </div>
              </div>
              <div className="numbered-item">
                <span className="number">03.</span>
                <div className="numbered-text">
                  <h3 className="numbered-item-title">Recevez votre commande</h3>
                  <p className="numbered-item-description">Livraison rapide et sécurisée directement à votre porte.</p>
                </div>
              </div>
            </div>
            <div className="numbered-image">
              <img src={settings?.howItWorksImageUrl || "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=600&fit=crop"} alt="Processus de commande" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
