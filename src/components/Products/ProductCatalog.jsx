import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/product';

export default function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await getProducts(currentPage, debouncedSearch);
                const pagination = response.data.data;
                setProducts(pagination || []);
                setCurrentPage(response.data.current_page || 1);
                setTotalPages(response.data.last_page || 1);
                setError('');
            } catch (requestError) {
                console.error('Error fetching data:', requestError);
                setError('Failed to load products. Please verify your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, debouncedSearch]);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

    const styles = {
        container: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' },
        headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
        heading: { fontSize: '28px', color: '#222', margin: 0 },
        searchContainer: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '350px' },
        searchIcon: { position: 'absolute', left: '12px', color: '#888', fontSize: '16px' },
        searchInput: { width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' },
        centerMessage: { textAlign: 'center', margin: '60px 0', fontSize: '18px', color: '#666' },
        errorAlert: { padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '20px' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
        card: { border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' },
        imageContainer: { width: '100%', height: '200px', backgroundColor: '#f7f7f7' },
        image: { width: '100%', height: '100%', objectFit: 'cover' },
        cardContent: { padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
        brand: { fontSize: '11px', textTransform: 'uppercase', color: '#2563eb', fontWeight: 'bold', marginBottom: '4px' },
        productName: { fontSize: '18px', margin: '0 0 8px', color: '#333' },
        description: { fontSize: '14px', color: '#666', margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' },
        metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f0f0f0' },
        price: { fontSize: '20px', fontWeight: '700', color: '#16a34a' },
        stock: { fontSize: '13px', color: '#555' },
        footerCode: { fontSize: '11px', color: '#999', marginTop: '12px', fontFamily: 'monospace' },
        paginationRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '40px 0', paddingTop: '20px', borderTop: '1px solid #eaeaea' },
        pageIndicator: { fontSize: '15px', color: '#4b5563' },
        pageButton: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '500' },
        disabledButton: { color: '#9ca3af', backgroundColor: '#f3f4f6', cursor: 'not-allowed', borderColor: '#e5e7eb' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h1 style={styles.heading}>Product Catalog</h1>
                <div style={styles.searchContainer}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search name, code, or manufacturer..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {error && <div style={styles.errorAlert}>{error}</div>}
            {loading ? (
                <div style={styles.centerMessage}>Loading inventory items...</div>
            ) : products.length === 0 ? (
                <div style={styles.centerMessage}>No products match your criteria.</div>
            ) : (
                <div style={styles.grid}>
                    {products.map((product) => (
                        <article key={product.code} style={styles.card}>
                            <div style={styles.imageContainer}>
                                <img
                                    src={product.photo}
                                    alt={product.name}
                                    style={styles.image}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = 'https://placehold.co/280x200?text=No+Image';
                                    }}
                                />
                            </div>
                            <div style={styles.cardContent}>
                                <span style={styles.brand}>{product.manufacturer}</span>
                                <h3 style={styles.productName}>{product.name}</h3>
                                <p style={styles.description}>{product.description}</p>
                                <div style={styles.metaRow}>
                                    <span style={styles.price}>{formatCurrency(product.price)}</span>
                                    <span style={styles.stock}>Stock: <strong>{product.inventory_quantity}</strong></span>
                                </div>
                                <div style={styles.footerCode}>SKU/Code: {product.code}</div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div style={styles.paginationRow}>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ ...styles.pageButton, ...(currentPage === 1 ? styles.disabledButton : {}) }}
                    >
                        Previous
                    </button>
                    <span style={styles.pageIndicator}>Page <strong>{currentPage}</strong> of {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ ...styles.pageButton, ...(currentPage === totalPages ? styles.disabledButton : {}) }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
