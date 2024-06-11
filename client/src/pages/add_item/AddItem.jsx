import React, { useState } from 'react';
import './additem.css';

const AddItem = () => {
    const [itemId, setItemId] = useState('');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [dose, setDose] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log({ itemId, itemName, description, expireDate, dose });
    };

    return (
        <div className="form-container">
            <h1>Add New Item</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="itemId">Item ID:</label>
                    <input
                        type="text"
                        id="itemId"
                        name="itemId"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="itemName">Item Name:</label>
                    <input
                        type="text"
                        id="itemName"
                        name="itemName"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        cols="50"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="expireDate">Expiration Date:</label>
                    <input
                        type="date"
                        id="expireDate"
                        name="expireDate"
                        value={expireDate}
                        onChange={(e) => setExpireDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dose">Dose:</label>
                    <input
                        type="text"
                        id="dose"
                        name="dose"
                        value={dose}
                        onChange={(e) => setDose(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Add Item</button>
                </div>
            </form>
        </div>
    );
};

export default AddItem;
