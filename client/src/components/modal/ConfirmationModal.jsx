import React from 'react';
import PropTypes from 'prop-types';
import styles from './ConfirmationModal.module.scss';  // Ensure you have this style file set up

const ConfirmationModal = ({ isOpen, onClose, onConfirm, children, isError, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    {isLoading ? 'Please wait...' : children}
                </div>
                {!isLoading && (
                    <div className={styles.modalActions}>
                        <button onClick={onConfirm} className={styles.confirmButton}>Confirm</button>
                        <button onClick={onClose} className={styles.closeButton}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Define the prop types
ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    children: PropTypes.node.isRequired
};

export default ConfirmationModal;
