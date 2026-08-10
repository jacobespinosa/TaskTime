export function calculateGoalPercentage(value, goal) {
    if (goal <= 0) return 0;
    return Math.min((value / goal) * 100, 100);
}