import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsStorage, categoriesStorage, ordersStorage, authStorage } from '../utils/localStorage';
import { db, auth, storage } from '../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import './Admin.css';

// Basculer sur Firebase (auth + Firestore)
const USE_LOCAL_STORAGE = false;

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (USE_LOCAL_STORAGE) {
      // Mode localStorage
      const currentUser = authStorage.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchProducts();
        fetchCategories();
        fetchOrders();
        fetchSettings();
      }
    } else {
      // Mode Firebase (quand configuré)
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          fetchProducts();
          fetchCategories();
          fetchOrders();
          fetchSettings();
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (USE_LOCAL_STORAGE) {
      // Mode localStorage - accepte n'importe quel email/password pour le développement
      const user = authStorage.login(loginForm.email, loginForm.password);
      setUser(user);
      fetchProducts();
      fetchCategories();
      fetchOrders();
    } else {
      // Mode Firebase
      try {
        await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      } catch (error) {
        alert('Erreur de connexion: ' + error.message);
      }
    }
  };

  const handleLogout = async () => {
    if (USE_LOCAL_STORAGE) {
      authStorage.logout();
      setUser(null);
      navigate('/');
    } else {
      // Mode Firebase
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error('Erreur de déconnexion:', error);
      }
    }
  };

  const fetchProducts = async () => {
    if (USE_LOCAL_STORAGE) {
      const productsList = productsStorage.getAll();
      setProducts(productsList);
    } else {
      // Mode Firebase
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    }
  };

  const fetchCategories = async () => {
    if (USE_LOCAL_STORAGE) {
      const categoriesList = categoriesStorage.getAll();
      setCategories(categoriesList);
    } else {
      // Mode Firebase
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    }
  };

  const fetchOrders = async () => {
    if (USE_LOCAL_STORAGE) {
      const ordersList = ordersStorage.getAll();
      // Trier par date de création (plus récent en premier)
      ordersList.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setOrders(ordersList);
    } else {
      // Mode Firebase
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersQuery = query(ordersCollection, orderBy('createdAt', 'desc'));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      }
    }
  };

  const handleProductSubmit = async (productData) => {
    if (USE_LOCAL_STORAGE) {
      const productToSave = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 0,
        id: editingProduct?.id
      };

      productsStorage.save(productToSave);
      setEditingProduct(null);
      setShowProductForm(false);
      fetchProducts();
      alert(editingProduct ? 'Produit modifié avec succès!' : 'Produit ajouté avec succès!');
    } else {
      // Mode Firebase
      try {
        const productToSave = {
          ...productData,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock) || 0
        };

        if (editingProduct) {
          await updateDoc(doc(db, 'products', editingProduct.id), productToSave);
          setEditingProduct(null);
        } else {
          await addDoc(collection(db, 'products'), {
            ...productToSave,
            createdAt: new Date()
          });
        }
        setShowProductForm(false);
        fetchProducts();
        alert(editingProduct ? 'Produit modifié avec succès!' : 'Produit ajouté avec succès!');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde du produit');
      }
    }
  };

  const handleCategorySubmit = async (categoryData) => {
    if (USE_LOCAL_STORAGE) {
      const categoryToSave = {
        ...categoryData,
        id: editingCategory?.id
      };

      categoriesStorage.save(categoryToSave);
      setEditingCategory(null);
      setShowCategoryForm(false);
      fetchCategories();
      alert(editingCategory ? 'Catégorie modifiée avec succès!' : 'Catégorie ajoutée avec succès!');
    } else {
      // Mode Firebase
      try {
        if (editingCategory) {
          await updateDoc(doc(db, 'categories', editingCategory.id), categoryData);
          setEditingCategory(null);
        } else {
          await addDoc(collection(db, 'categories'), {
            ...categoryData,
            createdAt: new Date()
          });
        }
        setShowCategoryForm(false);
        fetchCategories();
        alert(editingCategory ? 'Catégorie modifiée avec succès!' : 'Catégorie ajoutée avec succès!');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la catégorie:', error);
        alert('Erreur lors de la sauvegarde de la catégorie');
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie? Les produits associés ne seront plus catégorisés.')) {
      if (USE_LOCAL_STORAGE) {
        categoriesStorage.delete(categoryId);
        fetchCategories();
      } else {
        // Mode Firebase
        try {
          await deleteDoc(doc(db, 'categories', categoryId));
          fetchCategories();
        } catch (error) {
          console.error('Erreur lors de la suppression de la catégorie:', error);
          alert('Erreur lors de la suppression de la catégorie');
        }
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      if (USE_LOCAL_STORAGE) {
        productsStorage.delete(productId);
        fetchProducts();
      } else {
        // Mode Firebase
        try {
          await deleteDoc(doc(db, 'products', productId));
          fetchProducts();
        } catch (error) {
          console.error('Erreur lors de la suppression du produit:', error);
          alert('Erreur lors de la suppression du produit');
        }
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (USE_LOCAL_STORAGE) {
      ordersStorage.update(orderId, { status: newStatus });
      fetchOrders();
    } else {
      // Mode Firebase
      try {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        fetchOrders();
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
      }
    }
  };

  const fetchSettings = async () => {
    if (USE_LOCAL_STORAGE) {
      setSettings(null);
    } else {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        } else {
          // Créer les settings par défaut
          const defaultSettings = {
            logoUrl: '',
            heroImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
            heroTitle: 'ALL BEAUTIFUL\nCOLLECTION',
            heroDiscount: '50% DE RÉDUCTION',
            whyChooseImageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
            howItWorksImageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=600&fit=crop',
            socialLinks: {
              facebook: '',
              instagram: '',
              whatsapp: ''
            },
            orderWhatsAppNumber: ''
          };
          await setDoc(doc(db, 'settings', 'site'), defaultSettings);
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
  };

  const handleSettingsSubmit = async (settingsData) => {
    if (USE_LOCAL_STORAGE) {
      alert('Mode localStorage - les paramètres ne sont pas sauvegardés');
    } else {
      try {
        await setDoc(doc(db, 'settings', 'site'), {
          ...settingsData,
          updatedAt: new Date()
        }, { merge: true });
        setSettings(settingsData);
        setShowSettingsForm(false);
        alert('Paramètres mis à jour avec succès!');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde des paramètres');
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>Connexion Admin</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="login-button">Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Administration</h1>
        <button onClick={handleLogout} className="logout-button">Déconnexion</button>
      </header>

      <div className="admin-tabs">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Produits
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Catégories
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => {
            setActiveTab('settings');
            if (!settings) fetchSettings();
          }}
        >
          Paramètres
        </button>
      </div>

      <main className="admin-main">
        {activeTab === 'products' && (
          <div className="products-admin">
            <div className="admin-section-header">
              <h2>Gestion des Produits</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="add-button"
              >
                + Ajouter un produit
              </button>
            </div>

            {showProductForm && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onClose={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                onSubmit={handleProductSubmit}
              />
            )}

            <div className="products-list">
              {products.length === 0 ? (
                <p className="empty-state">Aucun produit. Ajoutez-en un pour commencer.</p>
              ) : (
                products.map(product => (
                  <ProductAdminCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-admin">
            <div className="admin-section-header">
              <h2>Gestion des Catégories</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setShowCategoryForm(true);
                }}
                className="add-button"
              >
                + Ajouter une catégorie
              </button>
            </div>

            {showCategoryForm && (
              <CategoryForm
                category={editingCategory}
                onClose={() => {
                  setShowCategoryForm(false);
                  setEditingCategory(null);
                }}
                onSubmit={handleCategorySubmit}
              />
            )}

            <div className="categories-list">
              {categories.length === 0 ? (
                <p className="empty-state">Aucune catégorie. Ajoutez-en une pour commencer.</p>
              ) : (
                categories.map(category => (
                  <CategoryAdminCard
                    key={category.id}
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-admin">
            <div className="admin-section-header">
              <h2>Paramètres du site</h2>
              <button
                onClick={() => {
                  setShowSettingsForm(true);
                }}
                className="add-button"
              >
                {settings ? 'Modifier les paramètres' : 'Configurer les paramètres'}
              </button>
            </div>

            {showSettingsForm && (
              <SettingsForm
                settings={settings}
                onClose={() => {
                  setShowSettingsForm(false);
                }}
                onSubmit={handleSettingsSubmit}
              />
            )}

            {settings && !showSettingsForm && (
              <div className="settings-preview">
                <h3>Aperçu des paramètres actuels</h3>
                <div className="settings-info">
                  <p><strong>Logo:</strong> {settings.logoUrl ? '✓ Configuré' : '✗ Non configuré'}</p>
                  <p><strong>Image Hero:</strong> {settings.heroImageUrl ? '✓ Configurée' : '✗ Non configurée'}</p>
                  <p><strong>Image "Pourquoi choisir":</strong> {settings.whyChooseImageUrl ? '✓ Configurée' : '✗ Non configurée'}</p>
                  <p><strong>Image "Comment ça marche":</strong> {settings.howItWorksImageUrl ? '✓ Configurée' : '✗ Non configurée'}</p>
                  <p><strong>Facebook:</strong> {settings.socialLinks?.facebook || 'Non configuré'}</p>
                  <p><strong>Instagram:</strong> {settings.socialLinks?.instagram || 'Non configuré'}</p>
                  <p><strong>WhatsApp:</strong> {settings.socialLinks?.whatsapp || 'Non configuré'}</p>
                  <p><strong>Numéro Commandes:</strong> {settings.orderWhatsAppNumber || 'Par défaut (Config)'}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

function SettingsForm({ settings, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    logoUrl: settings?.logoUrl || '',
    heroImageUrl: settings?.heroImageUrl || '',
    heroTitle: settings?.heroTitle || '',
    heroDiscount: settings?.heroDiscount || '',
    whyChooseImageUrl: settings?.whyChooseImageUrl || '',
    howItWorksImageUrl: settings?.howItWorksImageUrl || '',
    socialLinks: {
      facebook: settings?.socialLinks?.facebook || '',
      instagram: settings?.socialLinks?.instagram || '',
      whatsapp: settings?.socialLinks?.whatsapp || ''
    },
    orderWhatsAppNumber: settings?.orderWhatsAppNumber || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configurer les paramètres</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label>Numéro WhatsApp pour les commandes</label>
            <input
              type="text"
              name="orderWhatsAppNumber"
              value={formData.orderWhatsAppNumber}
              onChange={handleChange}
              placeholder="Ex: 221771234567 (Format international sans +)"
            />
            <p className="form-hint">Si vide, le numéro par défaut du fichier de configuration sera utilisé.</p>
          </div>

          <div className="form-section-title">Apparence</div>

          <div className="form-group">
            <label>URL du Logo</label>
            <input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Titre de la bannière (Hero)</label>
            <textarea
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              rows="2"
              placeholder="Titre principal"
            />
          </div>

          <div className="form-group">
            <label>Texte de réduction (Hero)</label>
            <input
              type="text"
              name="heroDiscount"
              value={formData.heroDiscount}
              onChange={handleChange}
              placeholder="Ex: 50% DE RÉDUCTION"
            />
          </div>

          <div className="form-group">
            <label>Image de bannière (Hero)</label>
            <input
              type="text"
              name="heroImageUrl"
              value={formData.heroImageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Image "Pourquoi nous choisir"</label>
            <input
              type="text"
              name="whyChooseImageUrl"
              value={formData.whyChooseImageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Image "Comment ça marche"</label>
            <input
              type="text"
              name="howItWorksImageUrl"
              value={formData.howItWorksImageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-section-title">Réseaux Sociaux</div>

          <div className="form-group">
            <label>Facebook URL</label>
            <input
              type="text"
              name="social_facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="form-group">
            <label>Instagram URL</label>
            <input
              type="text"
              name="social_instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="form-group">
            <label>WhatsApp URL (Contact)</label>
            <input
              type="text"
              name="social_whatsapp"
              value={formData.socialLinks.whatsapp}
              onChange={handleChange}
              placeholder="https://wa.me/..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductForm({ product, categories, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || '',
    categoryId: product?.categoryId || ''
  });
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  // Mettre à jour l'état quand le produit change
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || 0,
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId || ''
      });
      setImagePreview(product.imageUrl || '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: 0,
        imageUrl: '',
        categoryId: ''
      });
      setImagePreview('');
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop grande. Taille maximale : 5MB');
      return;
    }

    setUploading(true);

    try {
      // Chemin unique pour chaque image
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2, 8);
      const extension = file.name.split('.').pop() || 'jpg';
      const fileName = `products/${timestamp}_${random}.${extension}`;

      const storageRef = ref(storage, fileName);

      // Téléverser le fichier dans Firebase Storage
      await uploadBytes(storageRef, file);

      // Récupérer l'URL publique de téléchargement
      const downloadURL = await getDownloadURL(storageRef);

      // Enregistrer l'URL dans le formulaire
      setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
      setImagePreview(downloadURL);
    } catch (error) {
      console.error('Erreur lors du téléversement vers Firebase Storage:', error);
      alert('Erreur lors du téléversement de l\'image. Veuillez réessayer.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Nom du produit *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Prix de vente (XOF) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="1"
              min="0"
              required
              placeholder="Ex: 25000"
            />
          </div>
          <div className="form-group">
            <label>Stock disponible *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              placeholder="Ex: 50"
            />
          </div>
          <div className="form-group">
            <label>Catégorie *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="form-hint">Créez d'abord une catégorie dans l'onglet "Catégories"</p>
            )}
          </div>
          <div className="form-group">
            <label>Image du produit</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="file-input-label">
                {uploading ? 'Téléversement...' : '📷 Téléverser une image'}
              </label>
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Aperçu" className="image-preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                      setImagePreview('');
                      document.getElementById('image-upload').value = '';
                    }}
                    className="remove-image-button"
                  >
                    ✕ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="submit-button">
              {product ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductAdminCard({ product, onEdit, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (!stock || stock === 0) {
      return { text: 'Rupture de stock', className: 'out-of-stock' };
    } else if (stock < 10) {
      return { text: `${stock} en stock`, className: 'low-stock' };
    } else {
      return { text: `${stock} en stock`, className: 'in-stock' };
    }
  };

  const stockInfo = getStockStatus(product.stock);

  return (
    <div className="product-admin-card">
      <div className="product-admin-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-placeholder">📦</div>
        )}
      </div>
      <div className="product-admin-info">
        <h3>{product.name}</h3>
        {product.description && <p>{product.description}</p>}
        <div className="product-admin-details">
          <div className="product-admin-price">{formatPrice(product.price || 0)}</div>
          <div className={`product-admin-stock ${stockInfo.className}`}>
            {stockInfo.text}
          </div>
        </div>
      </div>
      <div className="product-admin-actions">
        <button onClick={() => onEdit(product)} className="edit-button">
          Modifier
        </button>
        <button onClick={() => onDelete(product.id)} className="delete-button">
          Supprimer
        </button>
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusUpdate }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#3b82f6';
      default: return '#64748b';
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <h3>Commande #{order.id.slice(0, 8)}</h3>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>
        <span
          className="order-status"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status === 'pending' && 'En attente'}
          {order.status === 'processing' && 'En cours'}
          {order.status === 'completed' && 'Terminée'}
          {order.status === 'cancelled' && 'Annulée'}
        </span>
      </div>
      <div className="order-details">
        <div className="order-section">
          <h4>Produit</h4>
          <p><strong>{order.productName}</strong></p>
          <p>Quantité: {order.quantity}</p>
          <p>Prix unitaire: {formatPrice(order.productPrice)}</p>
          <p className="order-total">Total: {formatPrice(order.productPrice * order.quantity)}</p>
        </div>
        <div className="order-section">
          <h4>Client</h4>
          <p><strong>{order.customerName}</strong></p>
          <p>📞 {order.customerPhone}</p>
          {order.customerEmail && <p>✉️ {order.customerEmail}</p>}
          {order.address && <p>📍 {order.address}</p>}
        </div>
        {order.notes && (
          <div className="order-section">
            <h4>Notes</h4>
            <p>{order.notes}</p>
          </div>
        )}
      </div>
      <div className="order-actions">
        <select
          value={order.status}
          onChange={(e) => onStatusUpdate(order.id, e.target.value)}
          className="status-select"
        >
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>
    </div>
  );
}

function CategoryForm({ category, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: category?.name || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Nom de la catégorie *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="submit-button">
              {category ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryAdminCard({ category, onEdit, onDelete }) {
  return (
    <div className="category-admin-card">
      <div className="category-admin-info">
        <h3>{category.name}</h3>
      </div>
      <div className="category-admin-actions">
        <button onClick={() => onEdit(category)} className="edit-button">
          Modifier
        </button>
        <button onClick={() => onDelete(category.id)} className="delete-button">
          Supprimer
        </button>
      </div>
    </div>
  );
}



export default Admin;
