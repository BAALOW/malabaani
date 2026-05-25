import "../../styles/admin.css";

const AdminFoods = ({
  products, filteredProducts,
  searchFood, setSearchFood,
  searchCategory, setSearchCategory,
  newProduct, setNewProduct,
  editingProduct, setEditingProduct,
  onAddProduct, onDeleteProduct, onUpdateProduct
}) => {
  return (
    <>
      <h2 className="admin-page-title">🍕 Food Management ({products.length})</h2>

      {/* ADD FOOD */}
      <div className="admin-card">
        <h3 className="admin-card-title">➕ Add New Food</h3>
        <div className="admin-form-grid">
          <input className="admin-input" placeholder="Food name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input className="admin-input" placeholder="Image URL"
            value={newProduct.urlImage}
            onChange={(e) => setNewProduct({ ...newProduct, urlImage: e.target.value })}
          />
          <input className="admin-input" placeholder="Price" type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <select className="admin-input"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            <option value="fastfood">🍔 Fast Food</option>
            <option value="drinks">🥤 Drinks</option>
            <option value="desserts">🍰 Desserts</option>
          </select>
          <button className="admin-add-btn" onClick={onAddProduct}>
            ➕ Add Food
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="admin-search-bar">
        <span style={{ fontSize: "18px" }}>🔍</span>
        <input
          className="admin-search-input"
          placeholder="Search food by name..."
          value={searchFood}
          onChange={(e) => setSearchFood(e.target.value)}
        />
        {searchFood && (
          <button className="admin-clear-btn" onClick={() => setSearchFood("")}>✕</button>
        )}
        <div className="admin-search-divider" />
        {["all", "fastfood", "drinks", "desserts"].map(cat => (
          <button
            key={cat}
            className={`admin-cat-btn ${searchCategory === cat ? "active" : ""}`}
            onClick={() => setSearchCategory(cat)}
          >
            {cat === "all" ? "🍽️ All" :
             cat === "fastfood" ? "🍔 Food" :
             cat === "drinks" ? "🥤 Drinks" : "🍰 Desserts"}
          </button>
        ))}
        <span className="admin-result-count">
          {filteredProducts.length} / {products.length} foods
        </span>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3 style={{ marginTop: 0 }}>✏️ Edit Food</h3>
            <input className="admin-input" placeholder="Food name"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            />
            <input className="admin-input" placeholder="Image URL"
              value={editingProduct.urlImage}
              onChange={(e) => setEditingProduct({ ...editingProduct, urlImage: e.target.value })}
            />
            <input className="admin-input" placeholder="Price" type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
            />
            <select className="admin-input"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
            >
              <option value="fastfood">🍔 Fast Food</option>
              <option value="drinks">🥤 Drinks</option>
              <option value="desserts">🍰 Desserts</option>
            </select>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="admin-add-btn" onClick={onUpdateProduct}>✅ Save</button>
              <button className="admin-delete-btn" onClick={() => setEditingProduct(null)}>✕ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* FOODS */}
      <div className="admin-card">
        {filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <p style={{ fontSize: "40px" }}>🔍</p>
            <p style={{ color: "#888", fontSize: "14px" }}>No foods found</p>
            <button className="admin-clear-search-btn"
              onClick={() => { setSearchFood(""); setSearchCategory("all"); }}
            >Clear Search</button>
          </div>
        ) : (
          <>
            {/* ✅ DESKTOP TABLE */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <img src={p.urlImage} alt={p.name} style={{
                          width: "45px", height: "45px",
                          borderRadius: "10px", objectFit: "cover"
                        }} />
                      </td>
                      <td><strong style={{ textTransform: "capitalize" }}>{p.name}</strong></td>
                      <td>
                        <span className="admin-badge badge-preparing">
                          {p.category === "fastfood" ? "🍔" :
                           p.category === "drinks" ? "🥤" : "🍰"} {p.category}
                        </span>
                      </td>
                      <td><strong style={{ color: "#1a73e8" }}>${p.price}</strong></td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="admin-edit-btn" onClick={() => setEditingProduct(p)}>
                            ✏️ Edit
                          </button>
                          <button className="admin-delete-btn" onClick={() => onDeleteProduct(p._id)}>
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ MOBILE CARDS */}
            <div className="admin-mobile-card">
              {filteredProducts.map((p, i) => (
                <div key={i} className="admin-mobile-item">
                  <div className="admin-mobile-item-header">
                    <div className="admin-mobile-item-info">
                      <img src={p.urlImage} alt={p.name} style={{
                        width: "50px", height: "50px",
                        borderRadius: "10px", objectFit: "cover"
                      }} />
                      <div>
                        <p className="admin-mobile-item-name" style={{ textTransform: "capitalize" }}>
                          {p.name}
                        </p>
                        <p className="admin-mobile-item-sub">
                          {p.category === "fastfood" ? "🍔" :
                           p.category === "drinks" ? "🥤" : "🍰"} {p.category}
                        </p>
                      </div>
                    </div>
                    <strong style={{ color: "#1a73e8", fontSize: "16px" }}>${p.price}</strong>
                  </div>
                  <div className="admin-mobile-item-actions">
                    <button className="admin-edit-btn" onClick={() => setEditingProduct(p)}>
                      ✏️ Edit
                    </button>
                    <button className="admin-delete-btn" onClick={() => onDeleteProduct(p._id)}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminFoods;