import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProducts, createProduct, updateProduct, deleteProduct } from "../firebase";
import { useToast } from "../context/ToastContext";

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
        <h2>Gerenciar Produtos</h2>
        <p>Faça login para gerenciar seus produtos.</p>
      </div>
    );
  }

  return (
    <div className="manage-container">
      <h2>⚙️ Meus Produtos</h2>

      <form className="product-form" onSubmit={handleSubmit}>
        <h3>{editing ? "Editar Produto" : "Adicionar Produto"}</h3>

        <div>
          <label>Nome do Produto *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <label>Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Imagem (URL)</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>

        <div>
          <label>Estoque</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Salvando..." : editing ? "Salvar Alterações" : "Adicionar Produto"}
          </button>
          {editing && (
            <button type="button" className="btn secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="products-list">
        <h3>Meus Produtos ({products.length})</h3>
        {products.length === 0 ? (
          <p style={{ color: "#999" }}>Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <div key={p.id} className="card manage-card">
                <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
                <h4>{p.name}</h4>
                <p className="price">R$ {p.price?.toFixed(2)}</p>
                <p style={{ fontSize: "0.8rem", color: "#aaa" }}>Estoque: {p.stock || 0}</p>
                <div className="card-actions">
                  <button className="btn secondary" onClick={() => handleEdit(p)}>
                    ✏️ Editar
                  </button>
                  <button className="btn danger" onClick={() => handleDelete(p.id)}>
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
