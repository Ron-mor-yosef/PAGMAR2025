import React, { useState, useEffect, useMemo } from "react";
import "./SingleStatistic.css";

function SingleStatistic({ statistic, hovered, onHover, onLeave, onClick }) {
    const total = 12 * 12;
    const filledCount = Math.round((statistic.percent / 100) * total);

    // Fill order: random or ordered
    const [fillOrder] = useState(() => {
        const arr = Array.from({ length: total }, (_, i) => i);
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    });

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
    }, [statistic.percent, statistic.color, statistic.source]);

    // State: how many are currently filled (animated in)
    const [filled, setFilled] = useState(0);

    useEffect(() => {
        setFilled(0); // reset on statistic change
        let i = 0;
        function animate() {
            if (i <= filledCount) {
                setFilled(i);
                i++;
                setTimeout(animate, 30);
            }
        }
        animate();
    }, [statistic.percent, statistic.color, statistic.source, hovered]);

    // Use ordered fill on hover, random otherwise
    const displayOrder = hovered
        ? Array.from({ length: total }, (_, i) => i)
        : fillOrder;

    return (
        <section
            className={`single-statistic${hovered ? " hovered" : ""}`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onClick}
        >
            <div className="single-statistic-grid">
                {Array.from({ length: total }).map((_, percentIndx) => {
                    const order = displayOrder.indexOf(percentIndx);
                    const isFilled = order < filled;
                    // Start with all transparent, then fill in
                    return (
                        <img
                            className={`single-percent${isFilled ? " animated-in" : ""}`}
                            key={percentIndx}
                            src={randomImages[percentIndx]}
                            style={{
                                rotate: `${randomRotations[percentIndx]}deg`,
                                borderColor: "transparent",
                                opacity: isFilled ? 1 : 0,
                            }}
                            alt=""
                        />
                    );
                })}
                <span className="single-stat-percent">{statistic.percent}%</span>
            </div>
            {/* Always show explanation under the grid */}
            <div className="single-stat-explain">{statistic.explanation}</div>
        </section>
    );
}

export default SingleStatistic;