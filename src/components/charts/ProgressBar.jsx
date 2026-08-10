import './ProgressBar.css';

function ProgressBar({percent, width, height, fillColor, backgroundColor}) {
    return (
        <div className='progress-bar-container'
            style={{
                width,
                height,
                backgroundColor
            }}
        >
            <div className='fill'
                style={{
                    width: `${percent}%`,
                    backgroundColor: fillColor
                }}
            >
            </div>
        </div>
    );
}

export default ProgressBar