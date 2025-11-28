// OCR Processor - Handle image upload and text extraction

class OCRProcessor {
    constructor() {
        this.worker = null;
        this.isInitialized = false;
    }

    // Initialize Tesseract worker
    async initialize() {
        if (this.isInitialized) return;

        try {
            console.log('🔄 Initializing Tesseract OCR worker...');
            console.log('⏳ This may take a few seconds on first load...');

            // Create worker - using simpler API for v5.x
            this.worker = await Tesseract.createWorker('eng', 1, {
                logger: m => {
                    if (m.status) {
                        console.log(`Tesseract: ${m.status}`, m.progress ? `${Math.round(m.progress * 100)}%` : '');
                    }
                }
            });

            this.isInitialized = true;
            console.log('✅ Tesseract OCR worker initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing OCR:', error);
            console.error('Error details:', error.message);
            throw new Error('Failed to initialize OCR. Please check your internet connection and refresh the page.');
        }
    }

    // Process image and extract text
    async processImage(imageFile, progressCallback) {
        await this.initialize();

        try {
            console.log('🖼️ Starting OCR processing...');

            // Update progress
            if (progressCallback) progressCallback(10);

            // Read image as data URL
            const imageData = await this.readImageFile(imageFile);

            if (progressCallback) progressCallback(20);

            console.log('🔍 Running Tesseract recognition...');

            // Perform OCR
            const result = await this.worker.recognize(imageData);

            console.log('✅ OCR completed. Confidence:', result.data.confidence.toFixed(2) + '%');

            if (progressCallback) progressCallback(100);

            // Log the extracted text for debugging
            console.log('📝 Extracted text:', result.data.text);

            return {
                text: result.data.text,
                confidence: result.data.confidence
            };
        } catch (error) {
            console.error('❌ OCR processing error:', error);
            console.error('Error details:', error.message, error.stack);
            throw new Error('Failed to process image. Please try a clearer image or type the menu manually.');
        }
    }

    // Read image file as data URL
    readImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                resolve(e.target.result);
            };

            reader.onerror = () => {
                reject(new Error('Failed to read image file'));
            };

            reader.readAsDataURL(file);
        });
    }

    // Preprocess image for better OCR (optional enhancement)
    async preprocessImage(imageElement) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        // Draw image
        ctx.drawImage(imageElement, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple grayscale conversion for better OCR
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    // Clean extracted text
    cleanExtractedText(rawText) {
        // Remove extra whitespace
        let cleaned = rawText.replace(/\s+/g, ' ').trim();

        // Remove common OCR artifacts
        cleaned = cleaned.replace(/[|]/g, 'I');
        cleaned = cleaned.replace(/[`'']/g, "'");
        cleaned = cleaned.replace(/[""]/g, '"');

        // Split by common delimiters
        let lines = cleaned.split(/[\n\r]+/);

        // Filter out very short lines and numbers-only lines
        lines = lines.filter(line => {
            const trimmed = line.trim();
            return trimmed.length > 2 && !/^\d+$/.test(trimmed);
        });

        return lines.join('\n');
    }

    // Validate image before processing
    validateImage(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
        }

        if (file.size > maxSize) {
            throw new Error('File too large. Please upload an image smaller than 10MB.');
        }

        return true;
    }

    // Terminate worker (cleanup)
    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
            this.isInitialized = false;
            this.worker = null;
        }
    }
}

// Export instance
const ocrProcessor = new OCRProcessor();
