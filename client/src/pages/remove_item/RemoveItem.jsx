import React, { useState } from 'react';
import './removeitem.css';

const RemoveItem = () => {
    const [itemId, setItemId] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log({ itemId });
    };

    return (
        <div className="form-container">
            <h1>Remove Item</h1>
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
                    <button type="submit">Remove Item</button>
                </div>
            </form>
        </div>
    );
};

export default RemoveItem;
