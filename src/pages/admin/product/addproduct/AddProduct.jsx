import React, { useState } from 'react';
import { db } from '../../../../firebaseConfig'; // Adjust the path to your firebaseConfig file
import { collection, addDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../../../components/sidebar/Sidebar.jsx';
import styles from './AddProduct.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faBox, faBuilding, faDollarSign, faIndustry, faPlus, faTag } from '@fortawesome/free-solid-svg-icons';

const AddProduct = () => {
  const [product, setProduct] = useState({
    ItemID: '',
    ItemName: '',
    Manufacturer: '',
    Supplier: '',
    QuantityInStock: '',
    Cost: '',
    UnitPrice: '',
    Barcode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        DateAdded: new Date(),
        LastUpdated: new Date(),
      });
      navigate('/admin/products'); // Redirect to products page after successful addition
    } catch (error) {
      console.error('Error adding product: ', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="flex-container">
        <Sidebar />
        <div className="content">
          <h2>Add Product</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faBox} /> Item ID</label>
              <input
                type="text"
                name="ItemID"
                value={product.ItemID}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faTag} /> Item Name</label>
              <input
                type="text"
                name="ItemName"
                value={product.ItemName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faIndustry} /> Manufacturer</label>
              <input
                type="text"
                name="Manufacturer"
                value={product.Manufacturer}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faBuilding} /> Supplier</label>
              <input
                type="text"
                name="Supplier"
                value={product.Supplier}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faPlus} /> Quantity In Stock</label>
              <input
                type="number"
                name="QuantityInStock"
                value={product.QuantityInStock}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faDollarSign} /> Cost</label>
              <input
                type="number"
                step="0.01"
                name="Cost"
                value={product.Cost}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faDollarSign} /> Price</label>
              <input
                type="number"
                step="0.01"
                name="UnitPrice"
                value={product.UnitPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label><FontAwesomeIcon icon={faBarcode} /> Barcode</label>
              <input
                type="text"
                name="Barcode"
                value={product.Barcode}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
            <Link to="/admin/products" className={styles.backButton}>Back to Products</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
