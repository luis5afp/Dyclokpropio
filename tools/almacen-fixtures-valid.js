'use strict';

/**
 * VALID, STATIC test-server payloads, not captured from any real account.
 * The bytes are the exact payloads the 127.0.0.1 fixture server sends.
 * They are never obfuscated, encrypted, converted, or repaired after receipt.
 */
const crypto = require('node:crypto');

// A complete standards-compliant ZIP with local header, central directory,
// and end-of-central-directory record. Contains only LEEME.txt test content.
const ZIP_BASE64 = 'UEsDBBQAAAAAACBScF35QD4TRQAAAEUAAAAJAAAATEVFTUUudHh0RXN0ZSBlcyB1biBhcmNoaXZvIFpJUCBkZSBwcnVlYmEgdmFsaWRvLg0KTm8gY29udGllbmUgZGF0b3MgcmVhbGVzLg0KUEsBAhQDFAAAAAAAIFJwXflAPhNFAAAARQAAAAkAAAAAAAAAAAAAAIABAAAAAExFRU1FLnR4dFBLBQYAAAAAAQABADcAAABsAAAAAAA=';
const ZIP_SHA256 = '2060d4cd96ba838a53e8e675ab5c62e4cfd34192d69e808fe5b7f9f4c8d65370';
const zip = Buffer.from(ZIP_BASE64, 'base64');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
if (sha(zip) !== ZIP_SHA256 || zip.readUInt32LE(0) !== 0x04034b50 ||
    zip.readUInt32LE(zip.length-22) !== 0x06054b50) {
  throw new Error('Invalid ZIP fixture source; refusing to archive damaged test data');
}

function makeServerFixtures(profileId) {
  const json = Buffer.from(JSON.stringify({
    origen: 'SERVIDOR_LOCAL_DE_PRUEBAS',
    perfil: profileId,
    cookie_de_prueba: 'FAKE_COOKIE_DEMO',
    credencial: 'FAKE_CREDENTIAL_DEMO',
    proxy: '127.0.0.1:9000',
    aviso: 'SOLO DATOS SIMULADOS; NO SE CAPTURA TRAFICO REAL'
  }, null, 2) + '\n', 'utf8');
  const txt = Buffer.from(
    'Archivo TXT original enviado por el servidor local de pruebas.\r\n' +
    'FAKE_CREDENTIAL=DEMO_123\r\n' +
    'FAKE_PROXY=127.0.0.1:9000\r\n', 'utf8');
  const binary = Buffer.from([0, 255, 128, 80, 75, 3, 4, 0, 16, 32, 0]);
  return [
    {
      originalName:'datos-prueba.json',path:'/datos-prueba.json', contentType:'application/json',
      bodyBytes:json, extraHeaders:['Set-Cookie: dicloak_lab=FAKE_COOKIE_DEMO; HttpOnly; Path=/']
    },
    {
      originalName:'ejemplo-lab.txt',path:'/ejemplo-lab.txt',contentType:'text/plain',
      bodyBytes:txt,extraHeaders:[]
    },
    {
      originalName:'ejemplo-lab.zip',path:'/ejemplo-lab.zip',contentType:'application/zip',
      bodyBytes:Buffer.from(zip),extraHeaders:[]
    },
    {
      originalName:'ejemplo-lab.bin',path:'/ejemplo-lab.bin',contentType:'application/octet-stream',
      bodyBytes:binary,extraHeaders:[]
    }
  ];
}

module.exports = { ZIP_BASE64, ZIP_SHA256, makeServerFixtures };
