// ========================================
// CipherSafe - Cryptography Module
// Member 2: Cryptography
// ========================================

const CIPHERSAFE_ALGORITHM = "AES-GCM";
const CIPHERSAFE_KEY_LENGTH = 256;
const CIPHERSAFE_HASH = "SHA-256";
const CIPHERSAFE_ITERATIONS = 100000;
const CIPHERSAFE_SALT_LENGTH = 16;
const CIPHERSAFE_IV_LENGTH = 12;

// Check whether the browser supports Web Crypto.
function isCryptoAvailable() {
    return (
        typeof crypto !== "undefined" &&
        crypto.subtle !== undefined
    );
}

// Check cryptography configuration.
function getCryptoConfiguration() {
    return {
        algorithm: CIPHERSAFE_ALGORITHM,
        keyLength: CIPHERSAFE_KEY_LENGTH,
        hash: CIPHERSAFE_HASH,
        iterations: CIPHERSAFE_ITERATIONS,
        saltLength: CIPHERSAFE_SALT_LENGTH,
        ivLength: CIPHERSAFE_IV_LENGTH
    };
}

// ============================================
// CipherSafe - Shared Cryptography Functions
// Member 2
// ============================================

// Derive a 256-bit AES key from a password.
async function deriveAESKey(password, salt, usage) {
    const encoder = new TextEncoder();

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: CIPHERSAFE_ITERATIONS,
            hash: CIPHERSAFE_HASH
        },
        passwordKey,
        {
            name: CIPHERSAFE_ALGORITHM,
            length: CIPHERSAFE_KEY_LENGTH
        },
        false,
        [usage]
    );
}


// Encrypt a message or a file's bytes.
async function encryptData(data, password) {
    if (!isCryptoAvailable()) {
        throw new Error("Web Crypto is not available.");
    }

    if (typeof password !== "string" || password.length === 0) {
        throw new Error("Password cannot be empty.");
    }

    const salt = crypto.getRandomValues(
        new Uint8Array(CIPHERSAFE_SALT_LENGTH)
    );

    const iv = crypto.getRandomValues(
        new Uint8Array(CIPHERSAFE_IV_LENGTH)
    );

    const aesKey = await deriveAESKey(
        password,
        salt,
        "encrypt"
    );

    const plaintext =
        typeof data === "string"
            ? new TextEncoder().encode(data)
            : data;

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: CIPHERSAFE_ALGORITHM,
            iv: iv
        },
        aesKey,
        plaintext
    );

    return {
        algorithm: CIPHERSAFE_ALGORITHM,
        keyLength: CIPHERSAFE_KEY_LENGTH,
        hash: CIPHERSAFE_HASH,
        iterations: CIPHERSAFE_ITERATIONS,
        salt: bytesToBase64(salt),
        iv: bytesToBase64(iv),
        ciphertext: bytesToBase64(
            new Uint8Array(ciphertext)
        )
    };
}


// Decrypt data using the same password and package.
async function decryptData(encryptedPackage, password) {
    if (!isCryptoAvailable()) {
        throw new Error("Web Crypto is not available.");
    }

    if (typeof password !== "string" || password.length === 0) {
        throw new Error("Password cannot be empty.");
    }

    if (
        !encryptedPackage ||
        encryptedPackage.algorithm !== CIPHERSAFE_ALGORITHM ||
        encryptedPackage.keyLength !== CIPHERSAFE_KEY_LENGTH ||
        encryptedPackage.hash !== CIPHERSAFE_HASH ||
        !Number.isInteger(encryptedPackage.iterations) ||
        encryptedPackage.iterations < 1
    ) {
        throw new Error("Invalid or unsupported encrypted package.");
    }

    const salt = base64ToBytes(encryptedPackage.salt);
    const iv = base64ToBytes(encryptedPackage.iv);
    const ciphertext = base64ToBytes(
        encryptedPackage.ciphertext
    );

    if (
        salt.length !== CIPHERSAFE_SALT_LENGTH ||
        iv.length !== CIPHERSAFE_IV_LENGTH
    ) {
        throw new Error("Invalid salt or IV.");
    }

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const aesKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: encryptedPackage.iterations,
            hash: encryptedPackage.hash
        },
        passwordKey,
        {
            name: encryptedPackage.algorithm,
            length: encryptedPackage.keyLength
        },
        false,
        ["decrypt"]
    );

    // AES-GCM authentication fails if the password is wrong
    // or the encrypted data has been modified.
    return crypto.subtle.decrypt(
        {
            name: CIPHERSAFE_ALGORITHM,
            iv: iv
        },
        aesKey,
        ciphertext
    );
}


// Convert bytes to Base64 for saving in JSON.
function bytesToBase64(bytes) {
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}


// Convert Base64 back to bytes.
function base64ToBytes(base64) {
    const binary = atob(base64);

    return Uint8Array.from(
        binary,
        character => character.charCodeAt(0)
    );
}