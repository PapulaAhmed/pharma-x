import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar.jsx';
import styles from './ProductManagement.module.scss';
import { Link } from 'react-router-dom';
import { db } from '../../../firebaseConfig'; // Adjust the path to your firebaseConfig file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Modal from '../../../components/modal/Modal';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('ItemName'); // Default search criteria
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'products'), orderBy('DateAdded', 'desc'));
        const querySnapshot = await getDocs(q);
        const productsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product: ', error);
      }
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const productDoc = doc(db, 'products', selectedProduct.id);
      await updateDoc(productDoc, {
        ...selectedProduct,
        LastUpdated: new Date(),
      });
      setIsModalOpen(false);
      const updatedProducts = products.map(p => p.id === selectedProduct.id ? selectedProduct : p);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product: ', error);
    }
    setIsLoading(false);
  };

  const filteredProducts = products.filter(product => {
    if (searchCriteria === 'ItemName' && product.ItemName) {
      return product.ItemName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchCriteria === 'Barcode' && product.Barcode) {
      return product.Barcode.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <div className="container">
      <div className="flex-container">
        <Sidebar />
        <div className="content">
          <h2>Item Management</h2>
          <p>Welcome to item management section where you can manage and define items in the system</p>
          <div className={styles["content-container"]}>
            <Link to="/admin/products/addproduct">Add Product</Link>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <select value={searchCriteria} onChange={handleCriteriaChange}>
                <option value="ItemName">Item Name</option>
                <option value="Barcode">Barcode</option>
              </select>
            </div>
            {isLoading ? (
              <div className={styles.spinner}></div>
            ) : (
              filteredProducts.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Item Name</th>
                      <th>Manufacturer</th>
                      <th>Supplier</th>
                      <th>Quantity</th>
                      <th>Cost</th>
                      <th>Price</th>
                      <th>Barcode</th>
                      <th className={styles.action}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>{product.ItemID}</td>
                        <td>{product.ItemName}</td>
                        <td>{product.Manufacturer}</td>
                        <td>{product.Supplier}</td>
                        <td>{product.QuantityInStock}</td>
                        <td>{product.Cost}</td>
                        <td>{product.UnitPrice}</td>
                        <td>{product.Barcode}</td>
                        <td className={styles.action}>
                          <a onClick={() => handleEdit(product)} className={styles.btn_icon}>
                            <FontAwesomeIcon className={styles.btn_icons} icon={faPenToSquare} title="Edit" />
                          </a>
                          <a onClick={() => handleDelete(product.id)} className={styles.btn_icon}>
                            <FontAwesomeIcon className={styles.btn_icons} icon={faTrash} title="Delete" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items currently available</p>
              )
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedProduct && (
          <form onSubmit={handleUpdateProduct} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Item ID</label>
              <input
                type="text"
                name="ItemID"
                value={selectedProduct.ItemID}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Item Name</label>
              <input
                type="text"
                name="ItemName"
                value={selectedProduct.ItemName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Manufacturer</label>
              <input
                type="text"
                name="Manufacturer"
                value={selectedProduct.Manufacturer}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Supplier</label>
              <input
                type="text"
                name="Supplier"
                value={selectedProduct.Supplier}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Quantity In Stock</label>
              <input
                type="number"
                name="QuantityInStock"
                value={selectedProduct.QuantityInStock}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Cost</label>
              <input
                type="number"
                step="0.01"
                name="Cost"
                value={selectedProduct.Cost}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                name="UnitPrice"
                value={selectedProduct.UnitPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Barcode</label>
              <input
                type="text"
                name="Barcode"
                value={selectedProduct.Barcode}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Product;
