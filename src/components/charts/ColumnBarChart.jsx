import { formatMinutesHHMMIncludeZero } from "../../utils/timeUtils";
import './ColumnBarChart.css';

function ColumnBarChart({title, data, maxValue, getKey, getValue, 
                         getBottomLabel, getTopLabel, getHoverInfo,
                         columnWidth, columnGap}) {
    const hourMarkers = Array.from({length: maxValue / 60}, (_, index) => {
        return (index + 1) * 60;
    })

    return (
        <div className="column-bar-chart-container">
            <h4 className='column-bar-chart-title'>
                {title}
            </h4> 
            <div className='column-bar-chart-area'>
                <div className='column-bar-chart-grid'>
                    {hourMarkers.map((mins) => {
                        const bottom = (mins / maxValue) * 100;
                        return (
                            <div key={mins}
                                    className='hour-marker'
                                    style={{"bottom": `${bottom}%`}}>
                                <span className='bar-chart-grid-label'>
                                    {mins / 60}h
                                </span>
                                <div className='hour-marker-line'></div>
                            </div>
                        );
                    })}
                </div>
                <ul className='column-bar-chart' style={{"gap": `${columnGap}`}}>
                    {data.map((item) => {
                        const value = getValue(item);
                        const percent = maxValue > 0 ? Math.min((value / (maxValue)) * 100, 100) : 0;

                        return (
                        <li key={getKey(item)} className='column-bar-chart-item'>
                            <div className='bar' style={{"width": `${columnWidth}`}}>
                                {getTopLabel(item) && (
                                    <div className='bar-label-top'
                                        style={{"bottom": `calc(${percent}% + 8px)`}}>
                                        {getTopLabel(item)}
                                    </div>
                                )}
                                <div className="progress-fill" 
                                     style={{"height": `${percent}%`}}
                                     title={getHoverInfo(item)}></div>
                            </div>
                            <div className="bar-chart-label">
                                {getBottomLabel(item)}
                            </div>
                        </li>  
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ColumnBarChart