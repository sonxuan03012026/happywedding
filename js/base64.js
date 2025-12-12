// ENCODE Hex (compatible với mọi browser)
function encodeCustom(text) {
  if (!text && text !== 0) return '';
  
  // UTF-8 encode thủ công
  const utf8Bytes = [];
  const str = text.toString();
  
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    
    if (charCode < 0x80) {
      utf8Bytes.push(charCode);
    } else if (charCode < 0x800) {
      utf8Bytes.push(0xC0 | (charCode >> 6));
      utf8Bytes.push(0x80 | (charCode & 0x3F));
    } else if (charCode < 0xD800 || charCode >= 0xE000) {
      utf8Bytes.push(0xE0 | (charCode >> 12));
      utf8Bytes.push(0x80 | ((charCode >> 6) & 0x3F));
      utf8Bytes.push(0x80 | (charCode & 0x3F));
    } else {
      // Surrogate pair
      i++;
      const nextCharCode = str.charCodeAt(i);
      const codePoint = 0x10000 + ((charCode & 0x3FF) << 10) + (nextCharCode & 0x3FF);
      
      utf8Bytes.push(0xF0 | (codePoint >> 18));
      utf8Bytes.push(0x80 | ((codePoint >> 12) & 0x3F));
      utf8Bytes.push(0x80 | ((codePoint >> 6) & 0x3F));
      utf8Bytes.push(0x80 | (codePoint & 0x3F));
    }
  }
  
  // Chuyển sang hex
  let hex = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    const hexByte = utf8Bytes[i].toString(16).toUpperCase();
    hex += (hexByte.length === 1 ? '0' : '') + hexByte;
  }
  
  return hex;
}

// DECODE Hex (compatible)
function decodeCustom(hex) {
  if (!hex) return '';
  
  // Hex → bytes
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  
  // UTF-8 decode thủ công
  let str = '';
  let i = 0;
  
  while (i < bytes.length) {
    const byte1 = bytes[i++];
    
    if (byte1 < 0x80) {
      str += String.fromCharCode(byte1);
    } else if (byte1 >= 0xC0 && byte1 < 0xE0) {
      const byte2 = bytes[i++];
      str += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F));
    } else if (byte1 >= 0xE0 && byte1 < 0xF0) {
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      str += String.fromCharCode(((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
    } else if (byte1 >= 0xF0) {
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      const byte4 = bytes[i++];
      const codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | 
                       ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
      
      if (codePoint > 0xFFFF) {
        str += String.fromCharCode(
          0xD800 + ((codePoint - 0x10000) >> 10),
          0xDC00 + ((codePoint - 0x10000) & 0x3FF)
        );
      } else {
        str += String.fromCharCode(codePoint);
      }
    }
  }
  
  return str;
}