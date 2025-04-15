import React from 'react';
import '../styles.css';

interface ProductCardProps {
    title: string;
    description: string;
}  

const ProductCard: React.FC<ProductCardProps> = ({ title, description }) => {
    return (
        <div className="product-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <a href="#" className="learn-more-link">Learn more</a>
        </div>
    );
};

export default ProductCard;