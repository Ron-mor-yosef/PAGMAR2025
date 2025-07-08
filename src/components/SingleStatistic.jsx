import React, { useState, useEffect, useMemo } from "react";
import "./SingleStatistic.css";

function SingleStatistic({ statistic, hovered, onHover, onLeave, onClick }) {
    const total = 12 * 12;
    const filledCount = Math.round((statistic.percent / 100) * total);

    // Fill order: randomly from bottom up, but last (top) line always left-aligned
    const fillOrder = useMemo(() => {
        const gridSize = 12;
        const order = [];
        const columns = Array.from({ length: gridSize }, (_, i) => i);
        // Fill from bottom up, randomize each row except the last (top) row
        for (let row = gridSize - 1; row >= 1; row--) {
            const shuffledCols = [...columns];
            for (let i = shuffledCols.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledCols[i], shuffledCols[j]] = [shuffledCols[j], shuffledCols[i]];
            }
            for (let col of shuffledCols) {
                order.push(row * gridSize + col);
            }
        }
        // Last (top) row: always left to right
        for (let col = 0; col < gridSize; col++) {
            order.push(col);
        }
        return order;
    }, []);

    // Generate random images and rotations ONCE per statistic
    const [randomImages, randomRotations] = useMemo(() => {
        const images = [];
        const rotations = [];
        for (let i = 0; i < total; i++) {
            images.push(
                process.env.PUBLIC_URL +
                `/assets/images/squares/${Math.ceil(Math.random() * 6)}.png`
            );
            rotations.push([90, 180, 270][Math.floor(Math.random() * 3)]);
        }
        return [images, rotations];
    }, [total]);

    // State: how many are currently filled (animated in)
    const [filled, setFilled] = useState(0);

    useEffect(() => {
        setFilled(0); // reset on statistic change
        let i = 0;
        function animate() {
            if (i <= filledCount) {
                setFilled(i);
                i++;
                setTimeout(animate, 8); // Faster animation
            }
        }
        animate();
    }, [statistic.percent, statistic.color, statistic.source, hovered, filledCount]);

    // Always use ordered fill
    const displayOrder = fillOrder;

    return (
        <section
            className={`single-statistic${hovered ? " hovered" : ""}`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onClick}
        >
            <div className={`single-statistic-grid ${hovered ? "hovered" : ""}`}>
                {Array.from({ length: total }).map((_, percentIndx) => {
                    const order = displayOrder.indexOf(percentIndx);
                    const isFilled = order < filled;
                    return (
                        <img
                            className={`single-percent${isFilled ? " animated-in" : ""}`}
                            key={percentIndx}
                            src={randomImages[percentIndx]}
                            style={{
                                rotate: `${randomRotations[percentIndx]}deg`,
                                borderColor: "transparent",
                                opacity: isFilled && !hovered ? 1 : 0,
                            }}
                            alt=""
                        />
                    );
                })}
                <span className="single-stat-percent" style={{ opacity: hovered ? 1 : 0 }}>{statistic.percent}%</span>
            </div>
            {/* Always show explanation under the grid */}
            <div className="single-stat-explain"><span className="single-stat-percent">{statistic.percent}%</span> {statistic.explanation}</div>
        </section>
    );
}

export default SingleStatistic;