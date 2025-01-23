import crypto from "crypto";

export function encriptarContra(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    const N = 32768;
    const r = 8;
    const p = 1;

    crypto.scrypt(password, salt, 64, { N, r, p }, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt.toString("hex") + ":" + derivedKey.toString("hex"));
    });
  });
}

export function verificarContra(password, hash) {
  return new Promise((resolve, reject) => {
    const [saltHex, keyHex] = hash.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const key = Buffer.from(keyHex, "hex");
    const N = 32768;
    const r = 8;
    const p = 1;

    crypto.scrypt(password, salt, 64, { N, r, p }, (err, derivedKey) => {
      if (err) reject(err);
      resolve(crypto.timingSafeEqual(derivedKey, key));
    });
  });
}
