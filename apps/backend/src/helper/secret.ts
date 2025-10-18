import hkdf from "@panva/hkdf";

const AUTH_SECRET = process.env.AUTH_SECRET || "";
const AUTH_COOKIE_NAME = process.env.NODE_ENV === 'production' ? `${process.env.PROD_SALT}` : `${process.env.DEV_SALT}`;
export async function getDerivedEncryptionKey(): Promise<Uint8Array> {
  return await hkdf(
    "sha256",
    AUTH_SECRET, // Secret key material
    AUTH_COOKIE_NAME, // Salt = session cookie name
    `Auth.js Generated Encryption Key (${AUTH_COOKIE_NAME})`, // Info string he fkt print karai use kel
    64 //  64 bytes (512 bits) for A256CBC-HS512
  );
}