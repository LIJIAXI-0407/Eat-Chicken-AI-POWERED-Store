import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import WelcomeHeader from '../../components/WelcomeHeader';
import WhiteRectangle from '../../components/WhiteRectangle';
import ProductModal from '../../components/ProductModal/ProductModal';
import trashIcon from '../../assets/images/trash.svg';
import cameraIcon from '../../assets/images/Camera.svg';
import { useProducts } from '../../context/ProductContext';
import '../../styles/shared.css';
import './product.css';

const Product = () => {
  const { 
    products, 
    setProducts, 
    generateNewId, 
    reorderIds 
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const handleAddProduct = () => {
    const newProduct = {
      id: generateNewId(),
      name: 'ABC',
      barcode: '1234567890',
      price: '$0.00',
      stock: '50'
    };
    setProducts([...products, newProduct]);
    setEditingProductId(newProduct.id);
  };

  const handleEditProduct = (product, field) => {
    setEditingProductId({ id: product.id, field });
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    const reorderedProducts = reorderIds(updatedProducts);
    setProducts(reorderedProducts);
    if (editingProductId?.id === productId) {
      setEditingProductId(null);
    }
  };

  const handleModalSubmit = (productData) => {
    if (editingProductId) {
      setProducts(products.map(product => 
        product.id === editingProductId.id ? { ...product, ...productData } : product
      ));
      setEditingProductId(null);
    } else {
      setProducts([...products, productData]);
    }
  };

  const handleCameraClick = () => {
    window.location.href = '/camera';
  };

  const handleCellChange = (e, productId, field) => {
    const value = e.target.value;
    setProducts(products.map(p => {
      if (p.id === productId) {
        if (field === 'price') {
          const numericValue = value.replace(/[^0-9.]/g, '');
          return { ...p, [field]: `$${numericValue}` };
        }
        if (field === 'stock') {
          const numericValue = value.replace(/[^0-9]/g, '');
          // 移除自动更新产品名称为"小玲"的逻辑
          return { ...p, [field]: numericValue };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const renderCell = (product, field) => {
    const isEditing = editingProductId?.id === product.id && editingProductId?.field === field;
    
    if (isEditing && field !== 'id') {
      return (
        <input
          type={field === 'price' || field === 'stock' ? 'number' : 'text'}
          value={field === 'price' ? product[field].replace('$', '') : product[field]}
          onChange={(e) => handleCellChange(e, product.id, field)}
          onBlur={() => setEditingProductId(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditingProductId(null);
            }
          }}
          className="cell-input"
          autoFocus
          min={field === 'price' || field === 'stock' ? '0' : undefined}
          step={field === 'price' ? '0.01' : '1'}
        />
      );
    }

    return (
      <div 
        className="product-data-cell editable-cell" 
        onClick={() => field !== 'id' && handleEditProduct(product, field)}
      >
        {product[field]}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className="product-welcome-container">
          <WelcomeHeader />
        </div>
        <div className="product-button-container">
          <button className="add-item-button" onClick={handleAddProduct}>
            Add items+
          </button>
        </div>
        <div className="product-rectangle-wrapper">
          <WhiteRectangle title="Product List">
            <div className="product-labels-row">
              <div className="product-label">No.</div>
              <div className="product-label">Product Name</div>
              <div className="product-label">
                Bar Code
                <img
                  src={cameraIcon}
                  alt="Scan Barcode"
                  className="camera-icon"
                  onClick={handleCameraClick}
                />
              </div>
              <div className="product-label">Price</div>
              <div className="product-label">Stock</div>
              <div className="product-label">Action</div>
            </div>
            <div className="product-separator"></div>
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`product-data-row ${parseInt(product.stock) < 5 ? 'low-stock-row' : ''}`}
              >
                <div className="product-data-cell">{product.id}</div>
                <div className="product-data-cell">
                  {renderCell(product, 'name')}
                </div>
                <div className="product-data-cell">
                  {renderCell(product, 'barcode')}
                </div>
                <div className="product-data-cell">
                  {renderCell(product, 'price')}
                </div>
                <div className="product-data-cell">
                  {renderCell(product, 'stock')}
                </div>
                <div className="product-data-cell">
                  <div className="product-actions">
                    <img
                      src={trashIcon}
                      alt="Delete"
                      className="product-action-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </WhiteRectangle>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Product; 