import './SummaryCard.css';

function SummaryCard({value, title}) {
    return (
        <div className='summary-card'>
            <span className="value">{value}</span>
            <span className='title'>{title}</span>
        </div>
    );
}

export default SummaryCard