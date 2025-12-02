import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProducts, createProduct, updateProduct, deleteProduct } from "../../firebase";
import { useToast } from "../../context/ToastContext";

export default function ManageProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  async function loadProducts() {
    const list = await getUserProducts(user.uid);
    setProducts(list);
  }

  function resetForm() {
    setForm({ name: "", description: "", price: "", image: "", stock: "" });
    setEditing(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        image: form.image,
        stock: parseInt(form.stock) || 0,
      };

      if (editing) {
        await updateProduct(editing, data);
        showToast('Produto atualizado com sucesso', { type: 'success' });
      } else {
        await createProduct(data, user.uid);
        showToast('Produto criado com sucesso', { type: 'success' });
      }

      resetForm();
      loadProducts();
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir este produto?")) return;
    await deleteProduct(id);
    await loadProducts();
    showToast('Produto excluído', { type: 'warning' });
  }

  function handleEdit(prod) {
    setEditing(prod.id);
    setForm({
      name: prod.name,
      description: prod.description || "",
      price: prod.price,
      image: prod.image || "",
      stock: prod.stock || 0,
    });
  }

  if (!user) {
    return (
      <div className="manage-container">
        <div className="manage-empty">
          <div className="empty-icon">🔐</div>
          <h2>Acesso Restrito</h2>
          <p>Faça login para gerenciar seus produtos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-container">
      <div className="manage-header">
        <div className="manage-header-content">
          <h2>📦 Gerenciar Produtos</h2>
          <p className="manage-subtitle">Adicione, edite ou remova produtos da sua loja</p>
        </div>
        <div className="manage-stats">
          <div className="stat-card">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Produtos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => p.stock > 0).length}</div>
            <div className="stat-label">Em Estoque</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => p.stock === 0).length}</div>
            <div className="stat-label">Esgotados</div>
          </div>
        </div>
      </div>

      <div className="manage-content">
        <div className="product-form-card">
          <div className="form-header">
            <h3>{editing ? "✏️ Editar Produto" : "➕ Novo Produto"}</h3>
            {editing && (
              <button type="button" className="btn-close-form" onClick={resetForm}>
                ✕
              </button>
            )}
          </div>

          <form className="product-form-modern" onSubmit={handleSubmit}>
            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Preview" onError={(e) => e.target.src = "https://via.placeholder.com/200"} />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>
                  <span className="label-icon">🏷️</span>
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Action Figure Digimon"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">💰</span>
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">📝</span>
                Descrição
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Descreva o produto..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <span className="label-icon">🖼️</span>
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">📊</span>
                  Estoque
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="form-actions-modern">
              <button type="submit" className="btn btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    {editing ? "💾 Salvar Alterações" : "➕ Adicionar Produto"}
                  </>
                )}
              </button>
              {editing && (
                <button type="button" className="btn btn-cancel" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-list-modern">
          <div className="list-header">
            <h3>📋 Seus Produtos</h3>
            <span className="product-count">{products.length} {products.length === 1 ? 'produto' : 'produtos'}</span>
          </div>

          {products.length === 0 ? (
            <div className="empty-products">
              <div className="empty-icon">📦</div>
              <p>Nenhum produto cadastrado ainda</p>
              <span className="empty-hint">Comece adicionando seu primeiro produto acima!</span>
            </div>
          ) : (
            <div className="products-grid-modern">
              {products.map((p) => (
                <div key={p.id} className="product-card-manage">
                  <div className="product-card-image">
                    <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
                    {p.stock === 0 && <div className="out-of-stock-overlay">ESGOTADO</div>}
                    {p.stock > 0 && p.stock <= 5 && <div className="low-stock-badge">Últimas {p.stock} unidades</div>}
                  </div>
                  
                  <div className="product-card-content">
                    <h4 className="product-card-title">{p.name}</h4>
                    <p className="product-card-description">
                      {p.description || "Sem descrição"}
                    </p>
                    
                    <div className="product-card-info">
                      <div className="info-item">
                        <span className="info-label">Preço</span>
                        <span className="info-value price-value">R$ {p.price?.toFixed(2)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Estoque</span>
                        <span className={`info-value stock-value ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok'}`}>
                          {p.stock || 0} un.
                        </span>
                      </div>
                    </div>

                    <div className="product-card-actions">
                      <button className="btn-action btn-edit" onClick={() => handleEdit(p)}>
                        <span>✏️</span>
                        Editar
                      </button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(p.id)}>
                        <span>🗑️</span>
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
