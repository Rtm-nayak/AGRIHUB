// Helper function to get DOM elements
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Accordion functionality
function initializeAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}

// Quiz functionality
function initializeQuiz() {
    const quizContainer = $('#quiz-container');
    if (!quizContainer) return;

    const questions = [
        {
            question: "Which farming practice helps improve soil health?",
            options: [
                "Crop rotation",
                "Continuous monoculture",
                "Deep tilling",
                "Burning crop residue"
            ],
            correct: 0
        },
        {
            question: "What is sustainable agriculture?",
            options: [
                "Farming using only organic methods",
                "Farming that maintains productivity while preserving resources",
                "Farming without using any modern technology",
                "Farming focused only on maximum yield"
            ],
            correct: 1
        },
        {
            question: "Which irrigation method is most water-efficient?",
            options: [
                "Flood irrigation",
                "Sprinkler system",
                "Drip irrigation",
                "Manual watering"
            ],
            correct: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    function displayQuestion() {
        const question = questions[currentQuestion];
        quizContainer.innerHTML = `
            <div class="question fade-in">
                <h3>Question ${currentQuestion + 1}/${questions.length}</h3>
                <p>${question.question}</p>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="checkAnswer(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.checkAnswer = function(selected) {
        const question = questions[currentQuestion];
        const isCorrect = selected === question.correct;
        
        if (isCorrect) score++;
        
        const resultHTML = `
            <div class="question-result fade-in" style="color: ${isCorrect ? '#2e7d32' : '#c62828'}">
                <h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4>
                <p>The correct answer is: ${question.options[question.correct]}</p>
                <button onclick="nextQuestion()" class="submit-btn">
                    ${currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
            </div>
        `;
        
        quizContainer.innerHTML += resultHTML;
        $$('.quiz-option').forEach(btn => btn.disabled = true);
    };

    window.nextQuestion = function() {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    };

    function showResults() {
        const percentage = (score / questions.length) * 100;
        quizContainer.innerHTML = `
            <div class="quiz-results fade-in">
                <h3>Quiz Complete!</h3>
                <p>You scored ${score} out of ${questions.length} (${percentage}%)</p>
                <button onclick="resetQuiz()" class="submit-btn">Try Again</button>
            </div>
        `;
    }

    window.resetQuiz = function() {
        currentQuestion = 0;
        score = 0;
        displayQuestion();
    };

    displayQuestion();
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                Array.from(form.elements).forEach(input => {
                    if (input.checkValidity()) {
                        input.classList.remove('invalid');
                    } else {
                        input.classList.add('invalid');
                    }
                });
            }
        });
    });
}

// Weather widget functionality
function initializeWeatherWidget() {
    const weatherForm = $('#weather-form');
    const weatherDisplay = $('#weather-display');
    const cropSuggestions = $('#crop-suggestions');
    
    if (!weatherForm) return;

    weatherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const location = $('#location').value;
        
        // Show loading state
        weatherDisplay.innerHTML = '<div class="loading">Fetching weather data...</div>';
        cropSuggestions.innerHTML = '';

        // Simulate API call (in real app, this would call a weather API)
        setTimeout(() => {
            const weatherData = simulateWeatherData(location);
            displayWeather(weatherData);
            displayCropSuggestions(weatherData);
        }, 1500);
    });

    function simulateWeatherData(location) {
        // Simulate different weather conditions based on location
        const conditions = ['Sunny', 'Partly Cloudy', 'Rainy', 'Cloudy'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            location: location,
            temperature: Math.floor(Math.random() * (35 - 15) + 15),
            humidity: Math.floor(Math.random() * (90 - 40) + 40),
            condition: condition,
            rainfall: Math.floor(Math.random() * 100)
        };
    }

    function displayWeather(data) {
        weatherDisplay.innerHTML = `
            <div class="weather-info fade-in">
                <h3>${data.location}</h3>
                <div class="weather-details">
                    <div class="weather-item">
                        <div class="icon">🌡️</div>
                        <p>${data.temperature}°C</p>
                        <p>Temperature</p>
                    </div>
                    <div class="weather-item">
                        <div class="icon">💧</div>
                        <p>${data.humidity}%</p>
                        <p>Humidity</p>
                    </div>
                    <div class="weather-item">
                        <div class="icon">☁️</div>
                        <p>${data.condition}</p>
                        <p>Conditions</p>
                    </div>
                    <div class="weather-item">
                        <div class="icon">🌧️</div>
                        <p>${data.rainfall}mm</p>
                        <p>Rainfall</p>
                    </div>
                </div>
            </div>
        `;
    }

    function displayCropSuggestions(weather) {
        const suggestions = getCropSuggestions(weather);
        cropSuggestions.innerHTML = `
            <div class="fade-in">
                <h3>Recommended Crops</h3>
                <ul>
                    ${suggestions.map(crop => `
                        <li>${crop}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    function getCropSuggestions(weather) {
        // Simple logic for crop suggestions based on weather
        const suggestions = [];
        
        if (weather.temperature > 25) {
            suggestions.push('Heat-resistant varieties of tomatoes');
            suggestions.push('Peppers');
            suggestions.push('Eggplants');
        } else {
            suggestions.push('Leafy greens');
            suggestions.push('Peas');
            suggestions.push('Root vegetables');
        }

        if (weather.humidity > 70) {
            suggestions.push('Rice');
            suggestions.push('Taro');
        } else {
            suggestions.push('Wheat');
            suggestions.push('Millet');
        }

        if (weather.rainfall > 50) {
            suggestions.push('Water-loving crops like Water Spinach');
        } else {
            suggestions.push('Drought-resistant crops like Sorghum');
        }

        return suggestions;
    }
}

// Disease Identifier functionality
function initializeDiseaseIdentifier() {
    const diseaseForm = $('#disease-form');
    const diseaseDisplay = $('#disease-display');
    
    if (!diseaseForm) return;

    diseaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const symptoms = Array.from($$('input[name="symptom"]:checked')).map(cb => cb.value);
        const cropType = $('#crop-type').value;

        if (symptoms.length === 0) {
            showDiseaseError('Please select at least one symptom');
            return;
        }

        // Show loading state
        diseaseDisplay.innerHTML = '<div class="loading">Analyzing symptoms...</div>';

        // Simulate disease analysis (in real app, this would use an AI model)
        setTimeout(() => {
            const possibleDiseases = analyzeDiseaseSymptoms(symptoms, cropType);
            displayDiseaseResults(possibleDiseases);
        }, 1500);
    });

    function showDiseaseError(message) {
        diseaseDisplay.innerHTML = `
            <div class="error-message" style="color: #ff4444; padding: 1rem;">
                ${message}
            </div>
        `;
    }

    function displayDiseaseResults(diseases) {
        const resultsHTML = `
            <div class="disease-results fade-in">
                <h3>Potential Issues Identified</h3>
                <div class="disease-cards">
                    ${diseases.map(disease => `
                        <div class="disease-card">
                            <h4>${disease.name}</h4>
                            <p class="severity ${disease.severity.toLowerCase()}">
                                Severity: ${disease.severity}
                            </p>
                            <div class="disease-details">
                                <p>${disease.description}</p>
                                <h5>Recommended Actions:</h5>
                                <ul>
                                    ${disease.treatment.map(step => `
                                        <li>${step}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="resetDiseaseForm()" class="reset-btn">
                    Check Another Crop
                </button>
            </div>
        `;

        diseaseDisplay.innerHTML = resultsHTML;
    }
}

function resetDiseaseForm() {
    const form = $('#disease-form');
    form.reset();
    $('#disease-display').innerHTML = '';
}

function analyzeDiseaseSymptoms(symptoms, cropType) {
    // Database of common crop diseases and their symptoms
    const diseaseDatabase = {
        'rice': {
            'leaf_spots': {
                name: 'Rice Blast',
                severity: 'High',
                description: 'A fungal disease causing diamond-shaped lesions on leaves.',
                treatment: [
                    'Apply fungicide specifically designed for rice blast',
                    'Improve field drainage',
                    'Maintain proper spacing between plants',
                    'Consider resistant varieties for next season'
                ]
            },
            'wilting': {
                name: 'Bacterial Blight',
                severity: 'Medium',
                description: 'Bacterial infection causing yellowing and wilting of leaves.',
                treatment: [
                    'Remove infected plants',
                    'Use copper-based bactericides',
                    'Ensure good air circulation',
                    'Avoid overhead irrigation'
                ]
            }
        },
        'wheat': {
            'yellow_patches': {
                name: 'Stripe Rust',
                severity: 'High',
                description: 'Fungal disease causing yellow stripes on leaves.',
                treatment: [
                    'Apply appropriate fungicide',
                    'Monitor weather conditions',
                    'Plant resistant varieties',
                    'Early season management'
                ]
            },
            'stunted_growth': {
                name: 'Root Rot',
                severity: 'Medium',
                description: 'Soil-borne pathogens affecting root development.',
                treatment: [
                    'Improve soil drainage',
                    'Rotate crops',
                    'Use treated seeds',
                    'Apply biological control agents'
                ]
            }
        },
        'corn': {
            'leaf_blight': {
                name: 'Northern Corn Leaf Blight',
                severity: 'Medium',
                description: 'Fungal disease causing long, gray-green lesions.',
                treatment: [
                    'Apply foliar fungicide',
                    'Practice crop rotation',
                    'Remove crop debris',
                    'Use resistant hybrids'
                ]
            },
            'stalk_rot': {
                name: 'Stalk Rot',
                severity: 'High',
                description: 'Fungal disease causing weakened stalks and lodging.',
                treatment: [
                    'Maintain proper plant nutrition',
                    'Avoid high plant populations',
                    'Control insects',
                    'Harvest early if severe'
                ]
            }
        }
    };

    // Match symptoms to diseases
    const possibleDiseases = [];
    const cropDiseases = diseaseDatabase[cropType] || {};

    for (const [symptomKey, disease] of Object.entries(cropDiseases)) {
        if (symptoms.includes(symptomKey)) {
            possibleDiseases.push(disease);
        }
    }

    // If no specific match found, provide general advice
    if (possibleDiseases.length === 0) {
        possibleDiseases.push({
            name: 'General Plant Stress',
            severity: 'Low',
            description: 'The symptoms may indicate general plant stress or early stage of disease.',
            treatment: [
                'Monitor the affected plants closely',
                'Ensure proper watering and nutrition',
                'Check for pest infestations',
                'Consider soil testing'
            ]
        });
    }

    return possibleDiseases;
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSmoothScrolling();
    initializeAccordions();
    initializeQuiz();
    initializeFormValidation();
    initializeWeatherWidget();
    initializeDiseaseIdentifier();
});
