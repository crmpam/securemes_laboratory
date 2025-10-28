import crypto from "crypto";

// Generar clave simétrica (32 bytes)
const key = crypto.randomBytes(32);

// Generar vector de inicialización (16 bytes)
const iv = crypto.randomBytes(12);

// Mensaje original
const message = "Este es un mensaje secreto 🔒";

function encrypt(text, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  // Obtener el tag de autenticación (16 bytes)
  const authTag = cipher.getAuthTag();

  // Devolvemos todo codificado en base64
  return {
    iv: iv.toString("base64"),
    content: encrypted.toString("base64"),
    tag: authTag.toString("base64"),
  };
}

// --- DESCIFRAR ---
function decrypt(encryptedData, key) {
  const { iv, content, tag } = encryptedData;

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}


// Ejecutar
const encrypted = encrypt(message, key, iv);
const decrypted = decrypt(encrypted, key, iv);

console.log("Clave (base64):", key.toString("base64"));
console.log("IV (base64):", iv.toString("base64"));
console.log(" Encriptado:", encrypted);
console.log(" Desencriptado:", decrypted);
