const express = require('express');

const app = express();

const redirectToHttps = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    // Redirect to HTTPS
    return res.redirect(
      ['https://', req.get('Host'), req.url].join('')
    );
  }

  next();
};

app.use(redirectToHttps); // Middleware to redirect HTTP requests to HTTPS

app.use((req, res, next) => {
    res.setHeader("referrer-policy", "origin"); // Set Referrer-Policy header to control the amount of referrer information sent with requests
    res.removeHeader('X-Powered-By'); // Remove the X-Powered-By header to prevent revealing the server technology
    res.setHeader("X-Content-Type-Options", "nosniff"); // Set X-Content-Type-Options header to prevent MIME type sniffing
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains"); // Set Strict-Transport-Security header to enforce secure connections
  next();
});

app.get('/list', (req, res) => {
  res.send([
    {
      id: 1,
      title: "Frontend System Design"
    }
  ]);
});

const port = process.env.PORT || 5010;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});