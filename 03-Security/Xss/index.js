const express = require('express');

const port = 3000;
const app = express();

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy", // Set Content Security Policy to prevent XSS attacks
        "default-src 'self'"  // Allow content only from the same origin
        + 
        "script-src 'self' 'nonce-randomKey' 'unsafe-inline' http://unsecure.com"  // Allow scripts from the same origin, with a nonce, inline scripts, and an unsecure source (for demonstration purposes only) 
    ); 
    next();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
