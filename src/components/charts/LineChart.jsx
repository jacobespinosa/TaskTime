import './LineChart.css';

function LineChart({title, data, maxValue, getBottomLabel, chartWidth, chartHeight, interval}) {

    const hourMarkers = Array.from({length: maxValue / interval}, (_, index) => {
        return (index + 1) * interval;
    })

    const padding = {
        right: 2,
        left: 20
    };

    const plotWidth = chartWidth - padding.left - padding.right;

    const points = data.map((item, index) => {
        const x = getX(index);

        const y =
            chartHeight -
            (item.time / maxValue) * chartHeight;

        return `${x},${y}`;
    }).join(" ");

    function getX(index) {
        if (data.length === 1) {
            return padding.left + plotWidth / 2;
        }

        return (
            padding.left +
            (index / Math.max((data.length - 1), 1) * plotWidth)
        );
    }

    return (
        <div className='line-chart-container'>
            <h3 className='line-chart-title'>
                {title}
            </h3>
            <div className='line-chart-area'>
                <div className='line-chart-grid'>
                    {hourMarkers.map((hours) => {
                        const bottom = (hours / maxValue) * 100;
                        return (
                            <div key={hours}
                                    className='hour-marker'
                                    style={{"bottom": `${bottom}%`}}>
                                <span className='line-chart-grid-label'>
                                    {hours}h
                                </span>
                                <div className='hour-marker-line'></div>
                            </div>
                        );
                    })}
                </div>
                <div className='line-chart'>
                    <svg
                        width="100%"
                        height={chartHeight}
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        preserveAspectRatio="none"
                    >
                        <polyline
                            points={points}
                            fill="none"
                            stroke="var(--blue)"
                            strokeWidth={3}
                        />
                    </svg>
                    <div className='line-chart-labels'>
                        {data.map((item, index) => {
                            const x = getX(index);

                            const currentLabel = getBottomLabel(item);
                            const previousLabel = index > 0
                                ? getBottomLabel(data[index - 1])
                                : null;

                            const shouldShowLabel = index === 0 || currentLabel !== previousLabel;

                            if (!shouldShowLabel) {
                                return null;
                            }

                            return (
                                <div
                                key={index}
                                    className="line-chart-bottom-label"
                                    style={{ left: `${(getX(index) / chartWidth) * 100}%` }}
                                >
                                    {currentLabel}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LineChart