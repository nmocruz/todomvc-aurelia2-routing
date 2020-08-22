
function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

export function generateRandomString(length = 28) {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  array = array.map(x => validChars.charCodeAt(x % validChars.length));
  return String.fromCharCode(...array);
}

export async function pkceChallengeFromVerifier(code_verifier){
    const hashed = await sha256(code_verifier);
    return base64urlencode(hashed);
}

function base64urlencode(str) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function parseQueryString(string) : {error?: string, code?: string; state?: string, error_description?: string }{
    if(string == "") { return {}; }
    var segments = string.split("&").map(s => s.split("=") );
    var queryString = {};
    segments.forEach(s => queryString[s[0]] = s[1]);
    return queryString;
}