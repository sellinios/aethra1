import React from 'react';

const Logo: React.FC = () => {
    const logoStyle: React.CSSProperties = {
        backgroundColor: 'orange',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px', // Increased width
        height: '60px', // Increased height
        borderRadius: '5px',
        textAlign: 'center',
        padding: '5px', // Added padding
    };

    const kTextStyle: React.CSSProperties = {
        fontSize: '36px', // Increased font size for "K"
        fontWeight: 'bold',
        lineHeight: '1',
    };

    const weatherTextStyle: React.CSSProperties = {
        fontSize: '14px', // Increased font size for "Weather"
        marginTop: '-5px', // Adjusted margin-top for closer positioning
        color: 'black', // Changed color to white
    };

    return (
        <div style={logoStyle}>
            <div style={kTextStyle}>K</div>
            <div style={weatherTextStyle}>Weather</div>
        </div>
    );
};

export default Logo;
