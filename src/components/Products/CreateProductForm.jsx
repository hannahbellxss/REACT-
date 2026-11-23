import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { storeProduct } from '../../api/product';

const initialFormData = {
    code: '',
    name: '',
    description: '',
    manufacturer: '',
    price: '',
    cost: '',
    inventory_quantity: '',
};

export default function CreateProductForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState(initialFormData);
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const setSelectedPhoto = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setErrors({ photo: ['Please select an image file.'] });
            return;
        }
        if (preview) URL.revokeObjectURL(preview);
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
        setErrors((current) => ({ ...current, photo: undefined }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleDrag = (event) => {
        event.preventDefault();
        setIsDragActive(event.type === 'dragenter' || event.type === 'dragover');
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragActive(false);
        setSelectedPhoto(event.dataTransfer.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setErrors({});
        setIsSubmitting(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (photo) data.append('photo', photo);

        try {
            await storeProduct(data);
            setMessage('Product created successfully!');
            setFormData(initialFormData);
            setPhoto(null);
            setPreview('');
        } catch (requestError) {
            const responseData = requestError.response?.data;
            setErrors(responseData?.errors || {});
            setMessage(responseData?.message || 'Unable to create product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldError = (field) => errors[field]?.[0];
    const fields = [
        ['code', 'Product Code', 'text'],
        ['name', 'Product Name', 'text'],
        ['manufacturer', 'Manufacturer', 'text'],
        ['price', 'Price', 'number'],
        ['cost', 'Cost', 'number'],
        ['inventory_quantity', 'Inventory Quantity', 'number'],
    ];

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '24px' }}>
            <h2>Create Protected Product</h2>
            {message && (
                <p role="status" style={{ color: errors && Object.keys(errors).length ? '#991b1b' : '#166534' }}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fields.map(([name, label, type]) => (
                    <label key={name} style={{ display: 'block', marginBottom: '16px' }}>
                        {label}
                        <input
                            name={name}
                            type={type}
                            value={formData[name]}
                            onChange={handleInputChange}
                            min={type === 'number' ? '0' : undefined}
                            step={name === 'price' || name === 'cost' ? '0.01' : undefined}
                            required
                            style={{ display: 'block', width: '100%', padding: '10px', marginTop: '6px' }}
                        />
                        {fieldError(name) && <small>{fieldError(name)}</small>}
                    </label>
                ))}
                <label style={{ display: 'block', marginBottom: '16px' }}>
                    Description
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" style={{ display: 'block', width: '100%', padding: '10px', marginTop: '6px' }} />
                    {fieldError('description') && <small>{fieldError('description')}</small>}
                </label>
                <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} style={{ border: '2px dashed #9ca3af', padding: '20px', textAlign: 'center', backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa' }}>
                    <p>Drag &amp; drop or click to upload product image</p>
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={(event) => setSelectedPhoto(event.target.files[0])} required={!photo} />
                    {preview && <img src={preview} alt="Product preview" style={{ display: 'block', maxWidth: '200px', maxHeight: '160px', margin: '16px auto 0' }} />}
                    {fieldError('photo') && <small>{fieldError('photo')}</small>}
                </div>
                <button type="submit" disabled={isSubmitting} style={{ marginTop: '20px', padding: '10px', background: '#2563eb', color: '#fff', border: 'none' }}>
                    {isSubmitting ? 'Uploading...' : 'Upload Product'}
                </button>
                <button type="button" onClick={() => navigate('/welcome')} style={{ marginTop: '20px', marginLeft: '12px', padding: '12px 20px' }}>Cancel</button>
            </form>
        </div>
    );
}
