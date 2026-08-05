import React, { useState, useEffect } from 'react';
import './LiveWorkout.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const workoutPlan = {
    push: [
        { id: 'push-1', prTracked: true, prLabel: 'Push-ups', variants: { 'Bodyweight Only': { name: 'Push-ups (standard)', sets: 4, target: 'max reps' }, 'Dumbbells': { name: 'Dumbbell Floor Press', sets: 4, target: '10 reps' }, 'Full Gym': { name: 'Barbell Bench Press', sets: 4, target: '8 reps' } } },
        { id: 'push-2', variants: { 'Bodyweight Only': { name: 'Incline push-ups', sets: 3, target: '10-12 reps' }, 'Dumbbells': { name: 'Dumbbell Incline Press', sets: 3, target: '10 reps' }, 'Full Gym': { name: 'Incline Barbell Press', sets: 3, target: '8 reps' } } },
        { id: 'push-3', variants: { 'Bodyweight Only': { name: 'Pike push-ups', sets: 3, target: '6-8 reps' }, 'Dumbbells': { name: 'Seated DB Shoulder Press', sets: 3, target: '10 reps' }, 'Full Gym': { name: 'Overhead Barbell Press', sets: 3, target: '8 reps' } } },
        { id: 'push-4', variants: { 'Bodyweight Only': { name: 'Diamond push-ups', sets: 3, target: '6-8 reps' }, 'Dumbbells': { name: 'DB Skull Crushers', sets: 3, target: '10 reps' }, 'Full Gym': { name: 'Cable Tricep Pushdown', sets: 3, target: '12 reps' } } },
        { id: 'push-5', variants: { 'Bodyweight Only': { name: 'Plank shoulder taps', sets: 3, target: '20 reps' }, 'Dumbbells': { name: 'Plank shoulder taps', sets: 3, target: '20 reps' }, 'Full Gym': { name: 'Plank shoulder taps', sets: 3, target: '20 reps' } } }
    ],
    pull: [
        { id: 'pull-1', prTracked: true, prLabel: 'Pull-ups', variants: { 'Bodyweight Only': { name: 'Pull-ups', sets: 5, target: 'max reps' }, 'Dumbbells': { name: 'DB Rows', sets: 4, target: '10/side' }, 'Full Gym': { name: 'Lat Pulldown', sets: 4, target: '10 reps' } } },
        { id: 'pull-2', variants: { 'Bodyweight Only': { name: 'Negative pull-ups', sets: 4, target: '3-5 reps' }, 'Dumbbells': { name: 'DB Rows', sets: 4, target: '10/side' }, 'Full Gym': { name: 'Assisted Pull-up Machine', sets: 4, target: '8 reps' } } },
        { id: 'pull-3', variants: { 'Bodyweight Only': { name: 'Inverted rows', sets: 3, target: '8-10 reps' }, 'Dumbbells': { name: 'DB Bent-over Rows', sets: 3, target: '10 reps' }, 'Full Gym': { name: 'Seated Cable Row', sets: 3, target: '10 reps' } } },
        { id: 'pull-4', variants: { 'Bodyweight Only': { name: 'Towel/doorframe rows', sets: 3, target: '10 reps' }, 'Dumbbells': { name: 'DB Rows', sets: 3, target: '10 reps' }, 'Full Gym': { name: 'T-Bar Row', sets: 3, target: '10 reps' } } },
        { id: 'pull-5', variants: { 'Bodyweight Only': { name: 'Superman holds', sets: 3, target: '15 reps' }, 'Dumbbells': { name: 'Superman holds', sets: 3, target: '15 reps' }, 'Full Gym': { name: 'Back Extension', sets: 3, target: '15 reps' } } }
    ],
    legs: [
        { id: 'legs-1', variants: { 'Bodyweight Only': { name: 'Bodyweight squats', sets: 4, target: '15-20 reps' }, 'Dumbbells': { name: 'Goblet Squats', sets: 4, target: '12 reps' }, 'Full Gym': { name: 'Barbell Squats', sets: 4, target: '10 reps' } } },
        { id: 'legs-2', variants: { 'Bodyweight Only': { name: 'Bulgarian split squats', sets: 3, target: '10/leg' }, 'Dumbbells': { name: 'DB Bulgarian Split Squats', sets: 3, target: '10/leg' }, 'Full Gym': { name: 'Heavier DB/Barbell Split Squats', sets: 3, target: '10/leg' } } },
        { id: 'legs-3', variants: { 'Bodyweight Only': { name: 'Glute bridges', sets: 3, target: '15 reps' }, 'Dumbbells': { name: 'DB Hip Thrusts', sets: 3, target: '12 reps' }, 'Full Gym': { name: 'Barbell Hip Thrusts', sets: 3, target: '10 reps' } } },
        { id: 'legs-4', variants: { 'Bodyweight Only': { name: 'Calf raises', sets: 3, target: '20 reps' }, 'Dumbbells': { name: 'DB Calf Raises', sets: 3, target: '15 reps' }, 'Full Gym': { name: 'Calf Raise Machine', sets: 3, target: '15 reps' } } },
        { id: 'legs-5', variants: { 'Bodyweight Only': { name: 'Plank', sets: 3, target: '30-45 sec' }, 'Dumbbells': { name: 'Plank (or weighted)', sets: 3, target: '30-45 sec' }, 'Full Gym': { name: 'Plank (or weighted)', sets: 3, target: '30-45 sec' } } },
        { id: 'legs-6', variants: { 'Bodyweight Only': { name: 'Leg raises', sets: 3, target: '12 reps' }, 'Dumbbells': { name: 'Leg raises', sets: 3, target: '12 reps' }, 'Full Gym': { name: 'Hanging Leg Raises', sets: 3, target: '12 reps' } } }
    ]
};

const API_URL = 'http://localhost:5000/api';

const LiveWorkout = () => {
    const { currentUser } = useUser();
    const userId = currentUser?.user?.id || 1; // Fallback to 1 if no user context

    const [view, setView] = useState('workout');
    const [equipmentMode, setEquipmentMode] = useState('Bodyweight Only');
    const [currentDay, setCurrentDay] = useState('push');
    
    const [logs, setLogs] = useState([]);
    const [bodyWeightLogs, setBodyWeightLogs] = useState([]);
    const [workoutDates, setWorkoutDates] = useState([]);

    const [modalData, setModalData] = useState(null);
    const [inputSets, setInputSets] = useState(1);
    const [inputReps, setInputReps] = useState(10);
    const [inputWeight, setInputWeight] = useState('');

    useEffect(() => {
        // Fetch data from our Node.js backend
        const fetchData = async () => {
            try {
                const logsRes = await axios.get(`${API_URL}/workout-logs/${userId}`);
                setLogs(logsRes.data || []);
                
                const bwRes = await axios.get(`${API_URL}/bodyweight/${userId}`);
                if (bwRes.data && bwRes.data.length > 0) {
                    setBodyWeightLogs(bwRes.data);
                } else {
                    setBodyWeightLogs([{ date: new Date().toISOString(), weight: 62 }]);
                }

                const dates = logsRes.data.map(l => l.date.split('T')[0]);
                setWorkoutDates([...new Set(dates)]);
            } catch (err) {
                console.error("Backend not reachable, falling back to empty state", err);
                setBodyWeightLogs([{ date: new Date().toISOString(), weight: 62 }]);
            }
        };
        fetchData();
    }, [userId]);

    const getStreak = () => {
        const dates = [...new Set(workoutDates)].sort();
        if (dates.length === 0) return 0;
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastWorkout = new Date(dates[dates.length - 1]);
        lastWorkout.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(Math.abs(today - lastWorkout) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
            streak = 1;
            for (let i = dates.length - 1; i > 0; i--) {
                const d1 = new Date(dates[i]);
                const d2 = new Date(dates[i - 1]);
                d1.setHours(0, 0, 0, 0);
                d2.setHours(0, 0, 0, 0);
                const diff = Math.ceil(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
                if (diff === 1) streak++; else break;
            }
        }
        return streak;
    };

    const handleLogWeight = async () => {
        const wt = prompt("Enter current weight (kg):", bodyWeightLogs[bodyWeightLogs.length - 1].weight);
        if (wt && !isNaN(wt)) {
            const entry = { userId, date: new Date().toISOString(), weight: parseFloat(wt) };
            setBodyWeightLogs([...bodyWeightLogs, entry]);
            try {
                await axios.post(`${API_URL}/bodyweight`, entry);
            } catch (e) { console.error(e); }
        }
    };

    const finishWorkout = () => {
        const today = new Date().toISOString().split('T')[0];
        if (!workoutDates.includes(today)) {
            setWorkoutDates([...workoutDates, today]);
        }
        alert("Workout saved! Great job today!");
    };

    const saveSet = async () => {
        const newLog = {
            userId,
            date: new Date().toISOString(),
            exId: modalData.ex.id,
            mode: equipmentMode,
            sets: inputSets,
            reps: inputReps,
            weight: parseFloat(inputWeight) || 0,
            prLabel: modalData.ex.prLabel || ''
        };
        
        // Optimistic UI Update
        setLogs([...logs, { ...newLog, id: Date.now() }]);
        setModalData(null);
        
        try {
            await axios.post(`${API_URL}/workout-logs`, newLog);
        } catch (e) {
            console.error("Failed to save to backend", e);
        }
    };

    // Calculate PRs
    const pushupLogs = logs.filter(l => l.prLabel === 'Push-ups' && l.mode === 'Bodyweight Only');
    const pullupLogs = logs.filter(l => l.prLabel === 'Pull-ups' && l.mode === 'Bodyweight Only');
    const maxPushups = pushupLogs.reduce((max, log) => Math.max(max, log.reps), 10);
    const maxPullups = pullupLogs.reduce((max, log) => Math.max(max, log.reps), 1);

    // Chart Data
    const getPrChartData = () => {
        const prMap = {};
        pushupLogs.forEach(log => {
            const d = log.date.split('T')[0].slice(5);
            if (!prMap[d] || log.reps > prMap[d]) prMap[d] = log.reps;
        });
        if (Object.keys(prMap).length === 0) prMap[new Date().toISOString().split('T')[0].slice(5)] = 10;
        const labels = Object.keys(prMap).sort();
        return {
            labels,
            datasets: [{
                label: 'Push-up PRs',
                data: labels.map(l => prMap[l]),
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                fill: true
            }]
        };
    };

    const getWeightChartData = () => {
        return {
            labels: bodyWeightLogs.map(l => l.date.split('T')[0].slice(5)),
            datasets: [{
                label: 'Body Weight (kg)',
                data: bodyWeightLogs.map(l => l.weight),
                borderColor: '#333',
                backgroundColor: 'rgba(51, 51, 51, 0.2)',
                fill: true
            }]
        };
    };

    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } } };

    return (
        <div id="live-workout-app">
            <header>
                <div className="header-top">
                    <h1>Live Tracker</h1>
                    <div className="streak-badge">🔥 {getStreak()}</div>
                </div>
                <div className="equipment-toggle">
                    {['Bodyweight Only', 'Dumbbells', 'Full Gym'].map(mode => (
                        <button key={mode} className={`eq-btn ${equipmentMode === mode ? 'active' : ''}`} onClick={() => setEquipmentMode(mode)}>
                            {mode.split(' ')[0]}
                        </button>
                    ))}
                </div>
                <div className="view-tabs">
                    <button className={`view-tab ${view === 'workout' ? 'active' : ''}`} onClick={() => setView('workout')}>Workout</button>
                    <button className={`view-tab ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Dashboard</button>
                </div>
            </header>

            <main>
                {view === 'dashboard' && (
                    <div className="view active">
                        <div className="pr-grid">
                            <div className="pr-item">
                                <span className="pr-label">Push-ups PR</span>
                                <span className="pr-value">{maxPushups}</span>
                            </div>
                            <div className="pr-item">
                                <span className="pr-label">Pull-ups PR</span>
                                <span className="pr-value">{maxPullups}</span>
                            </div>
                        </div>
                        <div className="lw-card">
                            <h3>Push-up Progress</h3>
                            <div className="chart-container">
                                <Line data={getPrChartData()} options={chartOptions} />
                            </div>
                        </div>
                        <div className="lw-card">
                            <div className="weight-entry">
                                <div>
                                    <h3>Body Weight</h3>
                                    <span className="current-weight">{bodyWeightLogs[bodyWeightLogs.length - 1]?.weight || 62} kg</span>
                                </div>
                                <button className="action-btn small" onClick={handleLogWeight}>Log Weight</button>
                            </div>
                            <div className="chart-container">
                                <Line data={getWeightChartData()} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                )}

                {view === 'workout' && (
                    <div className="view active">
                        <div className="workout-header">
                            <h2>Today's Workout</h2>
                            <select className="dropdown" value={currentDay} onChange={e => setCurrentDay(e.target.value)}>
                                <option value="push">Push Day</option>
                                <option value="pull">Pull Day</option>
                                <option value="legs">Legs Day</option>
                            </select>
                        </div>
                        
                        <div className="exercise-list">
                            {workoutPlan[currentDay].map(ex => {
                                const variant = ex.variants[equipmentMode];
                                const todayStr = new Date().toISOString().split('T')[0];
                                const todayLogs = logs.filter(l => l.exId === ex.id && l.date.startsWith(todayStr) && l.mode === equipmentMode);

                                return (
                                    <div key={ex.id} className="exercise-item">
                                        <div className="ex-header">
                                            <div className="ex-title">{variant.name}</div>
                                            <div className="ex-target">{variant.sets} sets | {variant.target}</div>
                                        </div>
                                        {todayLogs.length > 0 && (
                                            <div className="ex-logs">
                                                {todayLogs.map((log, idx) => (
                                                    <span key={idx} className="log-badge">
                                                        Set {idx + 1}: {log.sets}x{log.reps} {log.weight > 0 ? `@ ${log.weight}` : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <button className="action-btn small" onClick={() => {
                                            setModalData({ ex, variant });
                                            setInputSets(1);
                                            setInputReps(10);
                                            setInputWeight('');
                                        }}>+ Log Set</button>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <button className="action-btn block-btn primary-gradient" onClick={finishWorkout}>Finish Workout</button>
                    </div>
                )}
            </main>

            {modalData && (
                <div className="lw-modal active">
                    <div className="modal-content">
                        <h3>Log: {modalData.variant.name}</h3>
                        <div className="input-group">
                            <label>Sets Completed</label>
                            <div className="stepper">
                                <button className="step-btn" onClick={() => setInputSets(Math.max(1, inputSets - 1))}>-</button>
                                <input type="number" value={inputSets} readOnly />
                                <button className="step-btn" onClick={() => setInputSets(inputSets + 1)}>+</button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Reps per set</label>
                            <div className="stepper">
                                <button className="step-btn" onClick={() => setInputReps(Math.max(1, inputReps - 1))}>-</button>
                                <input type="number" value={inputReps} readOnly />
                                <button className="step-btn" onClick={() => setInputReps(inputReps + 1)}>+</button>
                            </div>
                        </div>
                        {equipmentMode !== 'Bodyweight Only' && (
                            <div className="input-group">
                                <label>Weight (kg/lbs)</label>
                                <input type="number" placeholder="e.g. 15" value={inputWeight} onChange={e => setInputWeight(e.target.value)} />
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="action-btn secondary" onClick={() => setModalData(null)}>Cancel</button>
                            <button className="action-btn primary" onClick={saveSet}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveWorkout;
