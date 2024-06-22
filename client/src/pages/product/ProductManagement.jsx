import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import styles from './ProductManagement.module.scss';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig'; // Adjust the path to your firebaseConfig file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import EditItemModal from '../../components/modal/EditItemModal.jsx';
import { TextField, Button, CircularProgress, Box, MenuItem, Grid } from '@mui/material';

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
          <Box mb={2} display="flex" alignItems="center" gap={2} marginTop={'10px'}>
            <TextField
              variant="outlined"
              label="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
            />
            <TextField
              select
              label="Search Criteria"
              value={searchCriteria}
              onChange={handleCriteriaChange}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="ItemName">Item Name</MenuItem>
              <MenuItem value="Barcode">Barcode</MenuItem>
            </TextField>
          </Box>
          <div className={styles["content-container"]}>
            <Link to="/app/products/addproduct">Add Product</Link>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="50vh" // Adjust this to center the spinner based on the viewport height
              >
                <CircularProgress />
              </Box>
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
                          <Button onClick={() => handleEdit(product)}>
                            <FontAwesomeIcon className={styles.btn_icons} icon={faPenToSquare} title="Edit" />
                          </Button>
                          <Button onClick={() => handleDelete(product.id)}>
                            <FontAwesomeIcon className={styles.btn_icons} icon={faTrash} title="Delete" />
                          </Button>
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

      <EditItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedProduct && (
          <form onSubmit={handleUpdateProduct} className={styles.form}>
            <TextField
              label="Item ID"
              name="ItemID"
              value={selectedProduct.ItemID}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Item Name"
              name="ItemName"
              value={selectedProduct.ItemName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Manufacturer"
              name="Manufacturer"
              value={selectedProduct.Manufacturer}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Supplier"
              name="Supplier"
              value={selectedProduct.Supplier}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Quantity In Stock"
              name="QuantityInStock"
              type="number"
              value={selectedProduct.QuantityInStock}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Cost"
              name="Cost"
              type="number"
              step="0.01"
              value={selectedProduct.Cost}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Price"
              name="UnitPrice"
              type="number"
              step="0.01"
              value={selectedProduct.UnitPrice}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Barcode"
              name="Barcode"
              value={selectedProduct.Barcode}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" color="primary" variant="contained" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Product'}
            </Button>
          </form>
        )}
      </EditItemModal>
    </div>
  );
};

export default Product;
