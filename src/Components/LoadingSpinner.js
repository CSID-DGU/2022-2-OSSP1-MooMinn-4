import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

const LoadingSpinner = () => {
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <PulseLoader color="#007FFF" size={12} margin={4} />
            </div>
        </div>
    );
}

export default LoadingSpinner;