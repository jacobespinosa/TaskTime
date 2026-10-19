import './PieChart.css';

function PieChart({title, data, width, formatValue, onHoverChange}) {
    const sortedData = data.toSorted((a, b) => b.value - a.value);
    const total = sortedData.reduce(
        (sum, { value }) => sum + value,
        0
    );

    let start = 0;

    const pieGradient = total <= 0
        ? "var(--shadow)"
        : `conic-gradient(${sortedData
            .map(({ color, value }) => {
                const percent = (value / total) * 100;

                const slice = `${color} ${start}% ${start + percent}%`;

                start += percent;

                return slice;
            })
            .join(", ")})`;

    return (
        <div className='pie-chart-container'>
            <h4 className='pie-chart-title'>{title}</h4>
            <div className='pie-chart'
                style={{
                    background: pieGradient,
                    width
                }}
                onMouseEnter={() => onHoverChange?.(true)}
                onMouseLeave={() => onHoverChange?.(false)}
            >
                <div className='pie-chart-center'
                     onMouseEnter={() => onHoverChange?.(false)}
                     onMouseLeave={() => onHoverChange?.(true)}
                >
                    {formatValue(total)}
                </div>
            </div>
        </div>
    );
}

export default PieChart