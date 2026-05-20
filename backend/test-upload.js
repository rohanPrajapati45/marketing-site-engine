// Quick test: upload a 1px PNG to /api/media/upload
// Run: node test-upload.js

import http from 'node:http';

// 1px red PNG
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(pngBase64, 'base64');

// First login to get cookie
const loginData = JSON.stringify({ email: 'mainadmin@example.com', password: 'mainadminpassword' });

const loginReq = http.request({
  hostname: 'localhost', port: 3000,
  path: '/api/auth/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
}, (loginRes) => {
  let body = '';
  loginRes.on('data', c => body += c);
  loginRes.on('end', () => {
    console.log('Login status:', loginRes.statusCode);
    const cookies = loginRes.headers['set-cookie'];
    console.log('Cookies:', cookies?.length, 'cookies set');
    
    if (loginRes.statusCode !== 200) {
      console.log('Login failed:', body);
      return;
    }

    // Extract cookie string
    const cookieStr = cookies?.map(c => c.split(';')[0]).join('; ') || '';
    console.log('Cookie:', cookieStr.slice(0, 50) + '...');

    // Now upload
    const boundary = '----FormBoundary' + Date.now();
    const parts = [];
    
    // folder field
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\ngeneral`);
    
    // image field
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n`);
    
    const bodyStart = Buffer.from(parts.join('\r\n') + '\r\n', 'utf-8');
    const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
    const fullBody = Buffer.concat([bodyStart, pngBuffer, bodyEnd]);

    const uploadReq = http.request({
      hostname: 'localhost', port: 3000,
      path: '/api/media/upload', method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length,
        'Cookie': cookieStr,
      }
    }, (uploadRes) => {
      let ubody = '';
      uploadRes.on('data', c => ubody += c);
      uploadRes.on('end', () => {
        console.log('\nUpload status:', uploadRes.statusCode);
        try {
          console.log('Upload response:', JSON.stringify(JSON.parse(ubody), null, 2));
        } catch {
          console.log('Upload raw:', ubody);
        }
      });
    });

    uploadReq.on('error', e => console.log('Upload request error:', e.message));
    uploadReq.write(fullBody);
    uploadReq.end();
  });
});

loginReq.on('error', e => console.log('Login error:', e.message));
loginReq.write(loginData);
loginReq.end();
