document.addEventListener("DOMContentLoaded", function() {
    const initiateButton = document.getElementById('initiate-assistant-btn');
    const container = document.getElementById('assistant-container');

    const MEALS = ['Breakfast', 'Lunch', 'Dinner'];
    let currentMealIndex = 0;

    // In a real app, these would come from user data.
    const PRESCRIBED_DOSES = {
        Breakfast: 10,
        Lunch: 8,
        Dinner: 12
    };

    if (initiateButton) {
        initiateButton.addEventListener('click', startAssistant);
    }

    function startAssistant() {
        currentMealIndex = 0;
        askQuestionForMeal();
    }

    function askQuestionForMeal() {
        if (currentMealIndex >= MEALS.length) {
            showCompletionMessage();
            return;
        }

        const meal = MEALS[currentMealIndex];
        container.innerHTML = `
            <div class="assistant-message">Did you have your ${meal} dose?</div>
            <div class="radio-options">
                <input type="radio" id="yes" name="doseTaken" value="yes">
                <label for="yes">Yes</label>
                <input type="radio" id="no" name="doseTaken" value="no">
                <label for="no">No</label>
            </div>
            <button id="continue-btn" class="option-btn">Continue</button>
        `;

        document.getElementById('continue-btn').addEventListener('click', () => {
            const choice = document.querySelector('input[name="doseTaken"]:checked');
            if (!choice) {
                alert('Please select an option.');
                return;
            }

            if (choice.value === 'yes') {
                askDoseAmount(meal);
            } else {
                showMessageAndProceed(getMissedDoseHTML());
            }
        });
    }

    // --- THIS FUNCTION IS UPDATED ---
    function askDoseAmount(meal) {
        const prescribedDose = PRESCRIBED_DOSES[meal]; // Get the prescribed dose for the hint
        container.innerHTML = `
            <div class="assistant-message">Great! How many units did you take for ${meal}?</div>
            <div class="prescribed-dose-hint">(Prescribed: ${prescribedDose} units)</div>
            <div>
                <input type="number" id="dose-input" class="dose-input" placeholder="Units">
                <button id="submit-dose-btn" class="option-btn">Submit</button>
            </div>
        `;

        document.getElementById('submit-dose-btn').addEventListener('click', () => {
            const doseTaken = document.getElementById('dose-input').value;
            if (doseTaken) {
                evaluateDose(parseInt(doseTaken, 10), meal);
            } else {
                alert("Please enter the number of units.");
            }
        });
    }

    function evaluateDose(doseTaken, meal) {
        const prescribedDose = PRESCRIBED_DOSES[meal];
        let messageHTML;

        if (doseTaken === prescribedDose) {
            messageHTML = `<div class="assistant-message">Good job! You've taken the correct dose for ${meal}.</div>`;
        } else if (doseTaken > prescribedDose) {
            messageHTML = getOverdoseHTML();
        } else {
            messageHTML = getUnderdoseHTML();
        }
        showMessageAndProceed(messageHTML);
    }
    
    function showMessageAndProceed(htmlContent) {
        container.innerHTML = htmlContent;
        setTimeout(() => {
            currentMealIndex++;
            askQuestionForMeal();
        }, 5000); // Wait for 5 seconds before proceeding
    }

    function showCompletionMessage() {
        container.innerHTML = `<div class="assistant-message">Awesome! You have completed your daily log.</div>`;
    }

    //HTML Templates for Messages

    function getMissedDoseHTML() {
        return `<div class="assistant-message">Please remember to have your dose on time to manage your health effectively.</div>`;
    }

    function getOverdoseHTML() {
        return `
            <div class="tip-card" style="background: #ffcccc; border: 2px solid #e74c3c;">
                <i class="fas fa-exclamation-triangle tip-icon" style="color:#e74c3c;"></i>
                <div class="tip-text" style="color:#721c24;">
                    <strong>Overdose Alert:</strong> You've taken more than your prescribed dose.
                    <ul>
                        <li>Check your blood sugar immediately.</li>
                        <li>If hypoglycemic (<70 mg/dL), consume fast-acting carbs.</li>
                        <li>Contact your healthcare provider immediately if symptoms like dizziness, confusion, or sweating appear.</li>
                    </ul>
                    <em>Always keep a sugar source handy and never skip monitoring after an overdose.</em>
                </div>
            </div>`;
    }

    function getUnderdoseHTML() {
        return `
            <div class="tip-card" style="background: #fff3cd; border: 2px solid #ffec99;">
                <i class="fas fa-exclamation-circle tip-icon" style="color:#856404;"></i>
                <div class="tip-text" style="color:#856404;">
                    <strong>Underdose Alert:</strong> You've taken less than your prescribed dose.
                    <ol>
                        <li>Check your blood sugar level as soon as possible.</li>
                        <li>Do not double your next dose without medical guidance.</li>
                        <li>Monitor your blood sugar frequently over the next few hours.</li>
                        <li>Contact your healthcare provider if you notice unusual or persistent high blood sugar levels.</li>
                    </ol>
                </div>
            </div>`;
    }
});