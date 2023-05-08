import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function App() {
    const [priceData, setPriceData] = useState([]);

    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const [minPriceDate, setMinPriceDate] = useState(null);
    const [maxPriceDate, setMaxPriceDate] = useState(null);

    useEffect(() => {
        async function getData() {
            const response = await fetch('http://localhost:7261/api/PricesJson7days');
            const data = await response.json();

            setPriceData(data.prices);
            const prices = data.prices.map(item => item.price);

            // haetaan halvimman hinnan sijainti datassa
            const minPriceIndex = prices.indexOf(Math.min(...prices));
            const maxPriceIndex = prices.indexOf(Math.max(...prices));

            // m‰‰ritet‰‰n min ja max hinnat
            setMinPrice(data.prices[minPriceIndex].price);
            setMaxPrice(data.prices[maxPriceIndex].price);

            // min ja max hintojen p‰ivm‰‰r‰t
            setMinPriceDate(data.prices[minPriceIndex].timeDate);
            setMaxPriceDate(data.prices[maxPriceIndex].timeDate);
        }
        getData();

        // p‰ivitett‰‰n sivua tunnin v‰lein

       const interval = setInterval(() => {
            getData();
        }, 3600000); // p‰ivitett‰‰n sivua tunnin v‰lein

        return () => clearInterval(interval);
        
    }, []);

    // n‰ytet‰‰n loading teksti jos dataa ei ole viel‰ saatu
    if (priceData.length === 0) {
        return <div>Loading data...</div>;
    }
    // piirret‰‰n kaavio datan perusteella
    return (
        <div>
            <h2>Hinnat 7 Vuorokautta</h2>
            <LineChart width={700} height={300} data={priceData}>
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="timeDate" />
                <YAxis label={{ value: 'snt/kWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
            </LineChart>
            {minPrice && maxPrice && (
                <p>
                    Alin Hinta: <b>{minPrice} snt/kWh</b> ({minPriceDate}:00) | Korkein Hinta:{' '}
                    <b>{maxPrice} snt/kWh</b> ({maxPriceDate}:00)
                </p>
                )}
        </div>
    );
}

export default App;