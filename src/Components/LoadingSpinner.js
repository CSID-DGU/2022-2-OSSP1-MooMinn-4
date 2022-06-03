import React from 'react';

const LoadingSpinner = () => {
    return (
        <div>
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    trnasform: "translate(-50%, -50%)",
                }}
            >
                로딩중...
            </div>
        </div>
    );
}

export default LoadingSpinner;