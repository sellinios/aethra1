import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import './GreekMunicipalities.css'; // Import the CSS file

interface Municipality {
    name: string;
    slug: string;
}

interface Region {
    name: string;
    municipalities: Municipality[];
}

const GreekMunicipalities: React.FC = () => {
    const [regions, setRegions] = useState<Region[]>([]);

    useEffect(() => {
        axios.get('/api/geography/greece/municipalities/')
            .then(response => {
                console.log('Response Data:', response.data); // Log the response data
                setRegions(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the municipalities!', error);
            });
    }, []);

    return (
        <Container>
            <h1>Greek Municipalities</h1>
            {regions.map(region => (
                <div key={region.name} className="region">
                    <h2 className="region-title">{region.name}</h2>
                    <div className="municipalities-list">
                        {region.municipalities.map(municipality => (
                            <div key={municipality.slug} className="municipality">
                                <h5>{municipality.name}</h5>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </Container>
    );
};

export default GreekMunicipalities;
