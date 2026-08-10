import './CreateProjectModal.css';
import { useState } from 'react';

function CreateProjectModal({ onSubmit, onClose }) {
    const [projectName, setProjectName] = useState("");
    const [projectColor, setProjectColor] = useState("#4CC9FE");
    const [isProgressTrackingEnabled, setIsProgressTrackingEnabled] = useState(false);

    const [progressGoal, setProgressGoal] = useState("");
    const [progressUnit, setProgressUnit] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        onSubmit(projectName, projectColor, isProgressTrackingEnabled, progressGoal, progressUnit);
        onClose();
    }

    return (
        <div className="project-modal-background">
            <div className="project-modal">
                <h2 className="project-modal-title">
                    Create Project
                </h2>
                <div className='divider'></div>
                <form className="project-form" 
                      onSubmit={handleSubmit}
                      id="create-project-form"
                >
                    <div className='project-name-color-container'>
                        <input type="text" 
                            className="project-name-input"
                            required
                            placeholder='Enter project name'
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                        <input type='color' 
                            className="project-color-input" 
                            value={projectColor}
                            onChange={(e) => setProjectColor(e.target.value)}
                        />
                    </div>
                    <div className='project-numeric-tracking'>
                        <h4 className='title'>Numeric Tracking?</h4>
                        <div className='radio-options'>
                            <input type='radio' name="numeric-tracking" id="yes" 
                                checked={isProgressTrackingEnabled}
                                onChange={() => setIsProgressTrackingEnabled(true)}
                            />
                            <label htmlFor="yes">Yes</label>
                            <input type="radio" name="numeric-tracking" id="no"
                                checked={!isProgressTrackingEnabled}
                                onChange={() => setIsProgressTrackingEnabled(false)}        
                            />
                            <label hmtlFor="no">No</label>
                        </div>
                        {isProgressTrackingEnabled && (
                            <div className="project-progress-options">
                                <input
                                    type="number"
                                    placeholder="Goal"
                                    min="1"
                                    value={progressGoal}
                                    required
                                    onChange={(e) => setProgressGoal(e.target.value)}
                                />

                                <input
                                    type="text"
                                    placeholder="Unit (e.g. problems)"
                                    value={progressUnit}
                                    required
                                    onChange={(e) => setProgressUnit(e.target.value)}
                                />
                            </div>
                        )}
                    </div> 
                </form>
                <div className='divider'></div>
                <button type="submit" 
                        className="add-project-btn" 
                        form="create-project-form"
                >
                    Create
                </button>
                <div className="project-close-btn" onClick={onClose}>
                    &times;
                </div>
            </div>
        </div>
    )
}

export default CreateProjectModal