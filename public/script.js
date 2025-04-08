const translations = {
    'pencil': 'lápiz',
    'pen': 'bolígrafo',
    'pencil case': 'estuche',
    'bagpack': 'mochila',
    'book': 'libro',
    'eraser': 'borrador',
    'highlighter': 'resaltador',
    'scissors': 'tijeras',
    'sharpener': 'sacapuntas',
    'rule': 'regla' 
};

// Cambiar el nombre de la constante URL a MODEL_URL
const MODEL_URL = "./my-model/";
let model, webcam, labelContainer, maxPredictions;
let isCapturing = false;

// Asegurarse de que el DOM esté cargado antes de acceder a los elementos
document.addEventListener('DOMContentLoaded', function() {
    labelContainer = document.getElementById("label-container");
});

async function init() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        document.getElementById("captureBtn").style.display = "block";
        document.getElementById("stopCameraBtn").style.display = "block"; // Show stop button
        
        if (labelContainer) {
            labelContainer.innerHTML = "";
        }
        
        requestAnimationFrame(loop);
    } catch (error) {
        console.error('Error initializing:', error);
    }
}

// Add new function to stop camera
async function stopCamera() {
    if (webcam) {
        webcam.stop();
        const webcamContainer = document.getElementById("webcam-container");
        const captureBtn = document.getElementById("captureBtn");
        const stopCameraBtn = document.getElementById("stopCameraBtn");
        
        webcamContainer.innerHTML = "";
        captureBtn.style.display = "none";
        stopCameraBtn.style.display = "none";
        
        // Reset any ongoing capture
        isCapturing = false;
    }
}

async function loop() {
    if (webcam && isCapturing) {
        webcam.update();
        requestAnimationFrame(loop);
    }
}

async function captureImage() {
    if (!isCapturing) {
        isCapturing = true;
        requestAnimationFrame(loop);
        document.getElementById("captureBtn").textContent = "Capturar";
    } else {
        isCapturing = false;
        const canvas = document.getElementById("previewCanvas");
        const previewContainer = document.querySelector('.preview-container');
        const resetBtn = document.getElementById("resetBtn");
        
        canvas.style.display = "block";
        previewContainer.style.display = "block";
        resetBtn.style.display = "block";
        
        // Set fixed dimensions for preview
        canvas.width = 400;
        canvas.height = 400;
        
        // Draw the webcam image maintaining aspect ratio
        const context = canvas.getContext("2d");
        context.fillStyle = "#000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(webcam.canvas, 0, 0, canvas.width, canvas.height);
        
        await predict(canvas);
    }
}

// Add this function to load the model
async function loadModel() {
    try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        return true;
    } catch (error) {
        console.error('Error loading model:', error);
        return false;
    }
}

// Modify the image upload handler
document.getElementById("imageUpload").addEventListener("change", async function(e) {
    const file = e.target.files[0];
    if (file) {
        // Stop camera if it's running
        if (webcam) {
            await stopCamera();
        }

        // Load model if not already loaded
        if (!model) {
            await loadModel();
        }
        
        const img = new Image();
        img.onload = async function() {
            const canvas = document.getElementById("previewCanvas");
            const previewContainer = document.querySelector('.preview-container');
            const resetBtn = document.getElementById("resetBtn");
            const predictBtn = document.getElementById("predictBtn");
            
            canvas.style.display = "block";
            previewContainer.style.display = "block";
            resetBtn.style.display = "block";
            predictBtn.style.display = "block"; // Show predict button
            
            // Set fixed dimensions for preview
            canvas.width = 400;
            canvas.height = 400;
            
            // Draw the uploaded image maintaining aspect ratio
            const context = canvas.getContext("2d");
            context.fillStyle = "#000";
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
        // Ahora usamos el objeto global window.URL
        img.src = window.URL.createObjectURL(file);
    }
});

function resetCapture() {
    const canvas = document.getElementById("previewCanvas");
    const previewContainer = document.querySelector('.preview-container');
    const resetBtn = document.getElementById("resetBtn");
    const predictBtn = document.getElementById("predictBtn");
    const labelContainer = document.getElementById("label-container");
    const imageUpload = document.getElementById("imageUpload");
    
    // Clear the canvas
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset file input
    imageUpload.value = "";
    
    canvas.style.display = "none";
    previewContainer.style.display = "none";
    resetBtn.style.display = "none";
    predictBtn.style.display = "none"; // Hide predict button
    labelContainer.innerHTML = "";
    
    if (webcam) {
        webcam.play();
        isCapturing = false;
        document.getElementById("captureBtn").textContent = "Tomar Foto";
    }
}

async function predict(image) {
    try {
        const prediction = await model.predict(image);
        let highestProbability = 0;
        let bestMatch = '';
        
        for (let i = 0; i < maxPredictions; i++) {
            if (prediction[i].probability > highestProbability) {
                highestProbability = prediction[i].probability;
                bestMatch = prediction[i].className;
            }
        }

        if (labelContainer) {
            if (highestProbability > 0.7) {
                labelContainer.innerHTML = `
                    <h2>¡Objeto Identificado!</h2>
                    <div class="prediction-item">
                        <p>En inglés se dice <strong>${bestMatch}</strong>.</p>
                        <p>Ejemplo de oración:</p>
                        <p><em>"This is my ${bestMatch}"</em></p>
                    </div>
                `;
            } else {
                labelContainer.innerHTML = `
                    <h2>No estoy seguro...</h2>
                    <div class="prediction-item">
                        <p>Por favor, intenta tomar otra foto con mejor iluminación o desde otro ángulo.</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error predicting:', error);
    }
}

// Update the predict function to handle the button click
async function predictFromButton() {
    const canvas = document.getElementById("previewCanvas");
    if (!model) {
        await loadModel();
    }
    await predict(canvas);
}