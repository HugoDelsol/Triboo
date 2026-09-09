// src/context/ConfirmContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import './ConfirmContext.css';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [confirmState, setConfirmState] = useState(null);

    const confirm = useCallback((message) => {
        return new Promise((resolve) => {
            setConfirmState({ message, resolve });
        });
    }, []);

    function handleChoice(choice) {
        confirmState.resolve(choice);
        setConfirmState(null);
    }

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {confirmState && (
                <>
                    <div className="sheet-backdrop" onClick={() => handleChoice(false)} />
                    <div className="confirm-dialog">
                        <p className="confirm-message">{confirmState.message}</p>
                        <div className="confirm-actions">
                            <button className="confirm-cancel" onClick={() => handleChoice(false)}>
                                Annuler
                            </button>
                            <button className="confirm-delete" onClick={() => handleChoice(true)}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    return useContext(ConfirmContext);
}