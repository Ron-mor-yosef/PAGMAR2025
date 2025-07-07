import React, { useEffect, useState } from "react";
import StatisticsSidebar from "../components/StatisticsSidebar";
import StatisticsByCategory from "../components/StatisticsByCategory";
import "./StatisticsPage.css";
import { loadCSV } from "../utils/parseCSV";


function parseCSV(table) {
    const parsedTable = {};

    for (let r = 0; r < table.length; r++) {
        const row = table[r];
        console.log(row);
        const explanation = row['הסבר'] || '-';
        const rawPercent = row['אחוזים'] || '0%';
        const category = row['קטגוריה'] || 'אחר';
        const color = `#${row['צבע'].replace('#', '')}` || '#5678FF';
        const source = row['מקורות'] || '-';
        const percent = parseFloat(rawPercent.replace('%', '').trim());

        if (isNaN(percent)) continue;

        const parsedRow = { explanation, percent, color, source }
        if (parsedTable[category]) {
            parsedTable[category].push(parsedRow)
        } else {
            parsedTable[category] = [parsedRow];
        }

    }
    return parsedTable;
}

const StatisticsPage = () => {
    const [statsByCategory, setStatsByCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState('');
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const handleCategorySelect = (category) => {
        setSelectedCategoryKey(category);
        setSelectedCategory(statsByCategory[category] ?? []);
        setHoveredIdx(null);
    };
    const getSelectedCategoryKey = ()=> selectedCategoryKey;

    useEffect(() => {
        loadCSV(process.env.PUBLIC_URL + "/statistics.csv").then((table) => {
            const parsed = parseCSV(table);
            setStatsByCategory(parsed);

            // choose the first category once we have data
            const first = Object.keys(parsed)[0];
            if (first) {
                setSelectedCategory(parsed[first]);
                setSelectedCategoryKey(first);
            }
        });
    }, []);


    // Get explanation and source for hovered stat, or first stat if none hovered
    const hoveredStat =
        selectedCategory && selectedCategory.length
            ? selectedCategory[hoveredIdx ?? 0]
            : null;
    const explanation = hoveredStat?.explanation || "";
    const source = hoveredStat?.source || "";

    return (
        <main className="statistics-page">
            <div className="statistics-page-inner-div">
                <StatisticsSidebar
                    statistics={statsByCategory}
                    onSelectStatistic={handleCategorySelect}
                    getSelectedStat={getSelectedCategoryKey}
                />
                                    <div className="statistics-source" style={{minWidth: '180px', maxWidth: '300px', fontSize: '1em', background: '#f0f8ff', borderRadius: '8px', padding: '0.7em', marginRight: '1em', alignSelf: 'flex-start'}}>
                        {source}
                    </div>
                <div className="statistics-main-content">

                    <StatisticsByCategory
                        statistics={selectedCategory}
                        hoveredIdx={hoveredIdx}
                        onHoverStat={setHoveredIdx}
                    />
                    
                </div>
            </div>
        </main>
    );
};

export default StatisticsPage;