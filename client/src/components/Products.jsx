import React, { useEffect, useState } from 'react';
import '../styles/Products.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Products = (props) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);

    // Define `fetchData` before `useEffect`
    const fetchData = async () => {
        try {
            const productsResponse = await axios.get('http://localhost:6001/fetch-products');
            const categoriesResponse = await axios.get('http://localhost:6001/fetch-categories');
            
            const productsData = productsResponse.data;
            setCategories(categoriesResponse.data);
            
            if (props.category === 'all') {
                setProducts(productsData);
                setVisibleProducts(productsData);
            } else {
                const filteredProducts = productsData.filter(product => product.category === props.category);
                setProducts(filteredProducts);
                setVisibleProducts(filteredProducts);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Fetch data when the component mounts or when `props.category` changes
    useEffect(() => {
        fetchData();
    }, [props.category]);

    const handleCategoryCheckBox = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setCategoryFilter([...categoryFilter, value]);
        } else {
            setCategoryFilter(categoryFilter.filter(category => category !== value));
        }
    };

    const handleGenderCheckBox = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setGenderFilter([...genderFilter, value]);
        } else {
            setGenderFilter(genderFilter.filter(gender => gender !== value));
        }
    };

    const handleSortFilterChange = (e) => {
        const value = e.target.value;
        setSortFilter(value);
        let sortedProducts = [...visibleProducts];
        if (value === 'low-price') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (value === 'high-price') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (value === 'discount') {
            sortedProducts.sort((a, b) => b.discount - a.discount);
        }
        setVisibleProducts(sortedProducts);
    };

    // Update visible products based on selected filters
    useEffect(() => {
        if (categoryFilter.length > 0 && genderFilter.length > 0) {
            setVisibleProducts(products.filter(product => categoryFilter.includes(product.category) && genderFilter.includes(product.gender)));
        } else if (categoryFilter.length === 0 && genderFilter.length > 0) {
            setVisibleProducts(products.filter(product => genderFilter.includes(product.gender)));
        } else if (categoryFilter.length > 0 && genderFilter.length === 0) {
            setVisibleProducts(products.filter(product => categoryFilter.includes(product.category)));
        } else {
            setVisibleProducts(products);
        }
    }, [categoryFilter, genderFilter, products]);

    return (
        <div className="products-container">
            <div className="products-filter">
                <h4>Filters</h4>
                <div className="product-filters-body">
                    <div className="filter-sort">
                        <h6>Sort By</h6>
                        <div className="filter-sort-body sub-filter-body">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio1" value="popularity" checked={sortFilter === 'popularity'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio1">
                                    Popular
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio2" value="low-price" checked={sortFilter === 'low-price'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio2">
                                    Price (low to high)
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio3" value="high-price" checked={sortFilter === 'high-price'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio3">
                                    Price (high to low)
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio4" value="discount" checked={sortFilter === 'discount'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio4">
                                    Discount
                                </label>
                            </div>
                        </div>
                    </div>

                    {props.category === 'all' &&
                        <div className="filter-categories">
                            <h6>Categories</h6>
                            <div className="filter-categories-body sub-filter-body">
                                {categories.map(category => (
                                    <div className="form-check" key={category}>
                                        <input className="form-check-input" type="checkbox" value={category} id={'productCategory' + category} checked={categoryFilter.includes(category)} onChange={handleCategoryCheckBox} />
                                        <label className="form-check-label" htmlFor={'productCategory' + category}>
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }

                    <div className="filter-gender">
                        <h6>Gender</h6>
                        <div className="filter-gender-body sub-filter-body">
                            {['Men', 'Women', 'Unisex'].map(gender => (
                                <div className="form-check" key={gender}>
                                    <input className="form-check-input" type="checkbox" value={gender} id={`filter-gender-check-${gender}`} checked={genderFilter.includes(gender)} onChange={handleGenderCheckBox} />
                                    <label className="form-check-label" htmlFor={`filter-gender-check-${gender}`}>
                                        {gender}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="products-body">
                <h3>All Products</h3>
                <div className="products">
                    {visibleProducts.map(product => (
                        <div className="product-item" key={product._id}>
                            <div className="product" onClick={() => navigate(`/product/${product._id}`)}>
                                <img src={product.mainImg} alt={product.title} />
                                <div className="product-data">
                                    <h6>{product.title}</h6>
                                    <p>{product.description.slice(0, 30) + '....'}</p>
                                    <h5>&#8377; {parseInt(product.price - (product.price * product.discount) / 100)} <s>{product.price}</s> <p>({product.discount}% off)</p></h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;