/**
 * Encryption/Decryption Application
 * Client-side encryption tool supporting multiple algorithms
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    EncryptionApp.init();
});

/**
 * Main Application Class
 */
const EncryptionApp = {
    // DOM Elements
    elements: {
        themeToggle: null,
        algorithmSelect: null,
        algorithmDescription: null,
        keySection: null,
        keyInput: null,
        togglePasswordBtn: null,
        keyHint: null,
        shiftSection: null,
        shiftInput: null,
        encryptInput: null,
        encryptCharCount: null,
        encryptOutput: null,
        decryptInput: null,
        decryptCharCount: null,
        decryptOutput: null,
        encryptBtn: null,
        decryptBtn: null,
        clearEncryptBtn: null,
        clearDecryptBtn: null,
        copyEncryptBtn: null,
        copyDecryptBtn: null,
        downloadEncryptBtn: null,
        downloadDecryptBtn: null,
        toast: null,
        toastMessage: null,
        loadingOverlay: null
    },

    // Algorithm descriptions
    algorithmDescriptions: {
        aes: '<strong>AES-256:</strong> Military-grade encryption using a 256-bit key. Requires a password for encryption/decryption.',
        caesar: '<strong>Caesar Cipher:</strong> A simple substitution cipher that shifts each letter by a fixed number. Enter a shift value (1-25).',
        base64: '<strong>Base64 Encoding:</strong> Converts binary data to ASCII text format. Not encryption, but useful for encoding data.',
        rot13: '<strong>ROT13:</strong> A special case of the Caesar cipher with a fixed shift of 13. Self-reversible.',
        reverse: '<strong>Reverse Text:</strong> Simply reverses the order of characters. Not secure encryption.',
        xor: '<strong>XOR Cipher:</strong> Uses bitwise XOR operation with a password key. Simple but effective symmetric encryption.'
    },

    // Algorithms that require a key/password
    keyRequiredAlgorithms: ['aes', 'xor'],

    // Algorithms that require a shift value
    shiftRequiredAlgorithms: ['caesar'],

    /**
     * Initialize the application
     */
    init() {
        // Cache DOM elements
        this.cacheElements();
        
        // Set up event listeners
        this.bindEvents();
        
        // Initialize theme
        this.initTheme();
        
        // Update algorithm description
        this.updateAlgorithmDescription();
        
        // Update UI based on selected algorithm
        this.updateAlgorithmUI();
    },

    /**
     * Cache all DOM elements for better performance
     */
    cacheElements() {
        this.elements.themeToggle = document.getElementById('themeToggle');
        this.elements.algorithmSelect = document.getElementById('algorithm');
        this.elements.algorithmDescription = document.getElementById('algorithmDescription');
        this.elements.keySection = document.getElementById('keySection');
        this.elements.keyInput = document.getElementById('encryptionKey');
        this.elements.togglePasswordBtn = document.getElementById('togglePassword');
        this.elements.keyHint = document.getElementById('keyHint');
        this.elements.shiftSection = document.getElementById('shiftSection');
        this.elements.shiftInput = document.getElementById('caesarShift');
        this.elements.encryptInput = document.getElementById('encryptInput');
        this.elements.encryptCharCount = document.getElementById('encryptCharCount');
        this.elements.encryptOutput = document.getElementById('encryptOutput');
        this.elements.decryptInput = document.getElementById('decryptInput');
        this.elements.decryptCharCount = document.getElementById('decryptCharCount');
        this.elements.decryptOutput = document.getElementById('decryptOutput');
        this.elements.encryptBtn = document.getElementById('encryptBtn');
        this.elements.decryptBtn = document.getElementById('decryptBtn');
        this.elements.clearEncryptBtn = document.getElementById('clearEncryptBtn');
        this.elements.clearDecryptBtn = document.getElementById('clearDecryptBtn');
        this.elements.copyEncryptBtn = document.getElementById('copyEncryptBtn');
        this.elements.copyDecryptBtn = document.getElementById('copyDecryptBtn');
        this.elements.downloadEncryptBtn = document.getElementById('downloadEncryptBtn');
        this.elements.downloadDecryptBtn = document.getElementById('downloadDecryptBtn');
        this.elements.toast = document.getElementById('toast');
        this.elements.toastMessage = document.getElementById('toastMessage');
        this.elements.loadingOverlay = document.getElementById('loadingOverlay');
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Algorithm selection
        if (this.elements.algorithmSelect) {
            this.elements.algorithmSelect.addEventListener('change', () => {
                this.updateAlgorithmDescription();
                this.updateAlgorithmUI();
            });
        }

        // Password visibility toggle
        if (this.elements.togglePasswordBtn && this.elements.keyInput) {
            this.elements.togglePasswordBtn.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }

        // Character count updates
        if (this.elements.encryptInput && this.elements.encryptCharCount) {
            this.elements.encryptInput.addEventListener('input', () => {
                this.updateCharacterCount(this.elements.encryptInput, this.elements.encryptCharCount);
            });
        }

        if (this.elements.decryptInput && this.elements.decryptCharCount) {
            this.elements.decryptInput.addEventListener('input', () => {
                this.updateCharacterCount(this.elements.decryptInput, this.elements.decryptCharCount);
            });
        }

        // Encrypt/Decrypt buttons
        if (this.elements.encryptBtn) {
            this.elements.encryptBtn.addEventListener('click', () => this.encrypt());
        }

        if (this.elements.decryptBtn) {
            this.elements.decryptBtn.addEventListener('click', () => this.decrypt());
        }

        // Clear buttons
        if (this.elements.clearEncryptBtn) {
            this.elements.clearEncryptBtn.addEventListener('click', () => this.clearEncrypt());
        }

        if (this.elements.clearDecryptBtn) {
            this.elements.clearDecryptBtn.addEventListener('click', () => this.clearDecrypt());
        }

        // Copy buttons
        if (this.elements.copyEncryptBtn) {
            this.elements.copyEncryptBtn.addEventListener('click', () => this.copyToClipboard(this.elements.encryptOutput, this.elements.copyEncryptBtn));
        }

        if (this.elements.copyDecryptBtn) {
            this.elements.copyDecryptBtn.addEventListener('click', () => this.copyToClipboard(this.elements.decryptOutput, this.elements.copyDecryptBtn));
        }

        // Download buttons
        if (this.elements.downloadEncryptBtn) {
            this.elements.downloadEncryptBtn.addEventListener('click', () => this.downloadText(this.elements.encryptOutput, 'encrypted'));
        }

        if (this.elements.downloadDecryptBtn) {
            this.elements.downloadDecryptBtn.addEventListener('click', () => this.downloadText(this.elements.decryptOutput, 'decrypted'));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.elements.encryptInput.value.trim()) {
                        this.encrypt();
                    } else if (this.elements.decryptInput.value.trim()) {
                        this.decrypt();
                    }
                }
            }
        });
    },

    /**
     * Initialize theme from localStorage or system preference
     */
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    },

    /**
     * Update algorithm description based on selection
     */
    updateAlgorithmDescription() {
        const algorithm = this.elements.algorithmSelect.value;
        if (this.elements.algorithmDescription) {
            this.elements.algorithmDescription.innerHTML = this.algorithmDescriptions[algorithm];
        }
    },

    /**
     * Update UI based on selected algorithm
     */
    updateAlgorithmUI() {
        const algorithm = this.elements.algorithmSelect.value;
        
        // Show/hide key/password input
        if (this.elements.keySection) {
            if (this.keyRequiredAlgorithms.includes(algorithm)) {
                this.elements.keySection.classList.add('visible');
                if (this.elements.keyHint) {
                    this.elements.keyHint.textContent = 'Required for AES and XOR encryption';
                }
            } else {
                this.elements.keySection.classList.remove('visible');
                this.elements.keyInput.value = '';
            }
        }

        // Show/hide shift input for Caesar cipher
        if (this.elements.shiftSection) {
            if (this.shiftRequiredAlgorithms.includes(algorithm)) {
                this.elements.shiftSection.classList.add('visible');
            } else {
                this.elements.shiftSection.classList.remove('visible');
            }
        }
    },

    /**
     * Toggle password visibility
     */
    togglePasswordVisibility() {
        const type = this.elements.keyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.elements.keyInput.setAttribute('type', type);
        
        // Update button icon
        const eyeIcon = this.elements.togglePasswordBtn.querySelector('.eye-icon');
        if (type === 'text') {
            eyeIcon.style.opacity = '0.7';
        } else {
            eyeIcon.style.opacity = '1';
        }
    },

    /**
     * Update character count display
     */
    updateCharacterCount(input, counterElement) {
        const count = input.value.length;
        counterElement.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    },

    /**
     * Show loading overlay
     */
    showLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.classList.add('show');
        }
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.classList.remove('show');
        }
    },

    /**
     * Show toast notification
     */
    showToast(message) {
        if (this.elements.toast && this.elements.toastMessage) {
            this.elements.toastMessage.textContent = message;
            this.elements.toast.classList.add('show');
            
            setTimeout(() => {
                this.elements.toast.classList.remove('show');
            }, 3000);
        }
    },

    /**
     * Validate inputs before encryption/decryption
     */
    validateInputs(isEncryption = true) {
        const algorithm = this.elements.algorithmSelect.value;
        const input = isEncryption ? this.elements.encryptInput : this.elements.decryptInput;
        
        if (!input.value.trim()) {
            this.showToast('Please enter text to ' + (isEncryption ? 'encrypt' : 'decrypt'));
            return false;
        }

        if (this.keyRequiredAlgorithms.includes(algorithm) && !this.elements.keyInput.value.trim()) {
            this.showToast('Please enter a password/key');
            this.elements.keyInput.focus();
            return false;
        }

        return true;
    },

    /**
     * Encrypt text using selected algorithm
     */
    encrypt() {
        if (!this.validateInputs(true)) return;

        const algorithm = this.elements.algorithmSelect.value;
        const inputText = this.elements.encryptInput.value;
        const key = this.elements.keyInput.value;
        const shift = parseInt(this.elements.shiftInput.value) || 3;

        this.showLoading();

        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                let result;
                
                switch (algorithm) {
                    case 'aes':
                        result = this.encryptAES(inputText, key);
                        break;
                    case 'caesar':
                        result = this.encryptCaesar(inputText, shift);
                        break;
                    case 'base64':
                        result = this.encryptBase64(inputText);
                        break;
                    case 'rot13':
                        result = this.encryptROT13(inputText);
                        break;
                    case 'reverse':
                        result = this.reverseText(inputText);
                        break;
                    case 'xor':
                        result = this.encryptXOR(inputText, key);
                        break;
                    default:
                        throw new Error('Unknown algorithm');
                }

                this.elements.encryptOutput.value = result;
                this.showToast('Encryption successful!');
            } catch (error) {
                console.error('Encryption error:', error);
                this.elements.encryptOutput.value = '';
                this.showToast('Encryption failed: ' + error.message);
            } finally {
                this.hideLoading();
            }
        }, 100);
    },

    /**
     * Decrypt text using selected algorithm
     */
    decrypt() {
        if (!this.validateInputs(false)) return;

        const algorithm = this.elements.algorithmSelect.value;
        const inputText = this.elements.decryptInput.value;
        const key = this.elements.keyInput.value;
        const shift = parseInt(this.elements.shiftInput.value) || 3;

        this.showLoading();

        setTimeout(() => {
            try {
                let result;
                
                switch (algorithm) {
                    case 'aes':
                        result = this.decryptAES(inputText, key);
                        break;
                    case 'caesar':
                        result = this.decryptCaesar(inputText, shift);
                        break;
                    case 'base64':
                        result = this.decryptBase64(inputText);
                        break;
                    case 'rot13':
                        result = this.encryptROT13(inputText); // ROT13 is self-reversible
                        break;
                    case 'reverse':
                        result = this.reverseText(inputText);
                        break;
                    case 'xor':
                        result = this.decryptXOR(inputText, key);
                        break;
                    default:
                        throw new Error('Unknown algorithm');
                }

                this.elements.decryptOutput.value = result;
                this.showToast('Decryption successful!');
            } catch (error) {
                console.error('Decryption error:', error);
                this.elements.decryptOutput.value = '';
                this.showToast('Decryption failed: Invalid key or corrupted data');
            } finally {
                this.hideLoading();
            }
        }, 100);
    },

    /**
     * AES-256 Encryption using CryptoJS
     */
    encryptAES(text, password) {
        if (!CryptoJS || !CryptoJS.AES) {
            throw new Error('CryptoJS library not available');
        }
        const encrypted = CryptoJS.AES.encrypt(text, password);
        return encrypted.toString();
    },

    /**
     * AES-256 Decryption using CryptoJS
     */
    decryptAES(encryptedText, password) {
        if (!CryptoJS || !CryptoJS.AES) {
            throw new Error('CryptoJS library not available');
        }
        const decrypted = CryptoJS.AES.decrypt(encryptedText, password);
        return decrypted.toString(CryptoJS.enc.Utf8);
    },

    /**
     * Caesar Cipher Encryption
     */
    encryptCaesar(text, shift) {
        return this.caesarCipher(text, shift);
    },

    /**
     * Caesar Cipher Decryption
     */
    decryptCaesar(text, shift) {
        return this.caesarCipher(text, -shift);
    },

    /**
     * Caesar Cipher implementation
     */
    caesarCipher(text, shift) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (char.match(/[a-z]/)) {
                const code = text.charCodeAt(i);
                let shifted = ((code - 97 + shift) % 26 + 26) % 26 + 97;
                result += String.fromCharCode(shifted);
            } else if (char.match(/[A-Z]/)) {
                const code = text.charCodeAt(i);
                let shifted = ((code - 65 + shift) % 26 + 26) % 26 + 65;
                result += String.fromCharCode(shifted);
            } else {
                result += char;
            }
        }
        
        return result;
    },

    /**
     * Base64 Encoding
     */
    encryptBase64(text) {
        try {
            return btoa(text);
        } catch (e) {
            // Handle Unicode characters
            return btoa(unescape(encodeURIComponent(text)));
        }
    },

    /**
     * Base64 Decoding
     */
    decryptBase64(encodedText) {
        try {
            return atob(encodedText);
        } catch (e) {
            // Handle Unicode characters
            try {
                return decodeURIComponent(escape(atob(encodedText)));
            } catch (e2) {
                throw new Error('Invalid Base64 encoding');
            }
        }
    },

    /**
     * ROT13 Encryption/Decryption
     */
    encryptROT13(text) {
        return text.replace(/[a-zA-Z]/g, function(char) {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + 13) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + 13) % 26) + 97);
            }
            return char;
        });
    },

    /**
     * Reverse Text
     */
    reverseText(text) {
        return text.split('').reverse().join('');
    },

    /**
     * XOR Encryption
     */
    encryptXOR(text, key) {
        if (!key) throw new Error('Key is required for XOR encryption');
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        
        // Encode as Base64 for readability
        return this.encryptBase64(result);
    },

    /**
     * XOR Decryption
     */
    decryptXOR(encryptedText, key) {
        if (!key) throw new Error('Key is required for XOR decryption');
        
        try {
            const decoded = this.decryptBase64(encryptedText);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            return result;
        } catch (e) {
            throw new Error('Invalid XOR encrypted data');
        }
    },

    /**
     * Clear encrypt input and output
     */
    clearEncrypt() {
        this.elements.encryptInput.value = '';
        this.elements.encryptOutput.value = '';
        this.updateCharacterCount(this.elements.encryptInput, this.elements.encryptCharCount);
    },

    /**
     * Clear decrypt input and output
     */
    clearDecrypt() {
        this.elements.decryptInput.value = '';
        this.elements.decryptOutput.value = '';
        this.updateCharacterCount(this.elements.decryptInput, this.elements.decryptCharCount);
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(textarea, button) {
        const text = textarea.value.trim();
        
        if (!text) {
            this.showToast('Nothing to copy!');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            
            // Add copied state to button
            const btnText = button.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Copied!';
            button.classList.add('copied');
            
            this.showToast('Copied to clipboard!');
            
            setTimeout(() => {
                btnText.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('Failed to copy. Please select and copy manually.');
        }
    },

    /**
     * Download text as .txt file
     */
    downloadText(textarea, prefix) {
        const text = textarea.value.trim();
        
        if (!text) {
            this.showToast('Nothing to download!');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `${prefix}_${timestamp}.txt`;
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast(`Downloaded ${filename}`);
    }
};
