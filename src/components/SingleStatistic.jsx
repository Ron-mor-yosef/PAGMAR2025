import React, { useState, useEffect, useMemo } from "react";
import "./SingleStatistic.css";

function SingleStatistic({ statistic, hovered, onHover, onLeave, onClick, className = '' }) {
    const total = 12 * 12;
    const filledCount = Math.round((statistic.percent / 100) * total);

    // Fill order: top right to bottom left
    const fillOrder = useMemo(() => {
        const gridSize = 12;
        const order = [];
        for (let row = 0; row < gridSize; row++) {
            for (let col = gridSize - 1; col >= 0; col--) {
                order.push(row * gridSize + col);
            }
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
            rotations.push([0,90, 180, 270][Math.floor(Math.random() * 4)] + (Math.random() - 0.5) * 10);
        }
        return [images, rotations];
    }, [total]);

    // State: how many are currently filled (animated in)
    const [filled, setFilled] = useState(0);

    // Animate only when a new category/statistic is loaded, not on hover changes
    useEffect(() => {
        setFilled(0);
        let i = 0;
        function animate() {
            if (i <= filledCount) {
                setFilled(i);
                i++;
                setTimeout(animate, 8);
            }
        }
        animate();
    }, [statistic.percent, statistic.color, statistic.source, filledCount]);

    // Always use ordered fill
    const displayOrder = fillOrder;

    return (
        <section
            className={`single-statistic${className ? ` ${className}` : ''}`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onClick}
        >
            <div className={`single-statistic-grid `}>
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
                                opacity: isFilled  ? 1 : 0,
                            }}
                            alt=""
                        />
                    );
                })}
                {/* <span className="single-stat-percent" style={{ opacity: hovered ? 1 : 0 }}>{statistic.percent}%</span> */}
            </div>
            {/* Always show explanation under the grid */}
            <div className="single-stat-explain"><span className="single-stat-percent">{statistic.percent}%</span> {statistic.explanation}</div>
        </section>
    );
}

export default SingleStatistic;