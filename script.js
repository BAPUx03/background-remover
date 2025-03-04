const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const outputSection = document.getElementById('outputSection');
const loading = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
const processedImage = document.getElementById('processedImage');

const API_KEY = "A7gApPYfJh5EsfiTbEmVQ2fr"; // Replace with your actual API key
const API_URL = "https://api.remove.bg/v1.0/removebg"; // Replace with your API endpoint

// Handle file selection
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

// Drag and drop handlers
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) handleFileSelect({ target: { files } });
});

async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
        alert("Please upload a valid image file (JPEG, PNG, WEBP).");
        return;
    }

    // Show loading state
    loading.classList.remove('hidden');
    outputSection.classList.add('hidden');

    try {
        // Process image using API
        const processedImageUrl = await processImage(file);
        processedImage.src = processedImageUrl;

        // Show output section
        outputSection.classList.remove('hidden');

        // Setup download
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = processedImageUrl;
            link.download = `background-removed-${Date.now()}.png`;
            link.click();
        });
    } catch (error) {
        alert('Error processing image: ' + error.message);
    } finally {
        loading.classList.add('hidden');
    }
}

async function processImage(file) {
    const formData = new FormData();
    formData.append('image_file', file);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        throw new Error('Failed to process image: ' + error.message);
    }
}
