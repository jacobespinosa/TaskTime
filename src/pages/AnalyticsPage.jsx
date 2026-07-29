import './AnalyticsPage.css';
import SummaryCardContainer from '../components/analytics/SummaryCardContainer';

function AnalyticsPage({timeByDate, weeklyTimeGoals, setWeeklyTimeGoals, tasksByDate}) {
    return (
        <main className='analytics'>
            <section className='analytics-content'>
                <div className='analytics-header'>
                    <h1>Analytics</h1>
                </div>
                <SummaryCardContainer 
                    timeByDate={timeByDate}
                    weeklyTimeGoals={weeklyTimeGoals}
                />
            </section>
        </main>
    );
}

export default AnalyticsPage