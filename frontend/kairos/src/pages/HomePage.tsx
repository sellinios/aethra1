import React from 'react';
import { Container } from 'react-bootstrap';
import CitiesWeather from '../components/CitiesWeather'; // Adjust the path if necessary

const HomePage = () => {
    return (
        <Container>
            <CitiesWeather />
            {/* AdSense units will be handled by the HTML */}
        </Container>
    );
}

export default HomePage;
