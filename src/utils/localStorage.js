// Système de stockage local pour tester sans Firebase

const STORAGE_KEYS = {
  PRODUCTS: 'amd_products',
  CATEGORIES: 'amd_categories',
  ORDERS: 'amd_orders',
  ADMIN_USER: 'amd_admin_user'
};

// Gestion des produits
export const productsStorage = {
  getAll: () => {
    try {
      const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return products ? JSON.parse(products) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des produits:', error);
      return [];
    }
  },
  
  save: (product) => {
    const products = productsStorage.getAll();
    if (product.id) {
      // Mise à jour
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        products[index] = { ...product };
      }
    } else {
      // Nouveau produit
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      products.push(newProduct);
      product.id = newProduct.id;
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  },
  
  delete: (id) => {
    const products = productsStorage.getAll();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  }
};

// Gestion des catégories
export const categoriesStorage = {
  getAll: () => {
    try {
      const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return categories ? JSON.parse(categories) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des catégories:', error);
      return [];
    }
  },
  
  save: (category) => {
    const categories = categoriesStorage.getAll();
    if (category.id) {
      // Mise à jour
      const index = categories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        categories[index] = { ...category };
      }
    } else {
      // Nouvelle catégorie
      const newCategory = {
        ...category,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      categories.push(newCategory);
      category.id = newCategory.id;
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return category;
  },
  
  delete: (id) => {
    const categories = categoriesStorage.getAll();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  }
};

// Gestion des commandes
export const ordersStorage = {
  getAll: () => {
    try {
      const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des commandes:', error);
      return [];
    }
  },
  
  save: (order) => {
    const orders = ordersStorage.getAll();
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: order.status || 'pending'
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },
  
  update: (id, updates) => {
    const orders = ordersStorage.getAll();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  }
};

// Gestion de l'authentification locale
export const authStorage = {
  login: (email, password) => {
    // Pour le développement, on accepte n'importe quel email/password
    const adminUser = {
      email: email,
      uid: 'local-admin-' + Date.now(),
      loggedIn: true,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(adminUser));
    return adminUser;
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  },
  
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
  
  // Observer pour simuler onAuthStateChanged
  onAuthStateChanged: (callback) => {
    const user = authStorage.getCurrentUser();
    callback(user);
    
    // Simuler un observer (on peut écouter les changements de localStorage)
    const interval = setInterval(() => {
      const currentUser = authStorage.getCurrentUser();
      callback(currentUser);
    }, 1000);
    
    return () => clearInterval(interval);
  }
};
