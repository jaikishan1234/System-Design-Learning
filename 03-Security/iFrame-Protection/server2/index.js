const express = require('express');
const app = express();

app.use(express.static('public'));

// app.use((req, res, next) => {
//     res.setHeader(
//         'Content-Security-Policy',
//         "frame-ancestors 'self'" // This directive allows the page to be framed only by pages from the same origin (self).
//     );

//     next();
// });

app.use((req, res, next) => {

    res.setHeader(
        'Content-Security-Policy',
        "frame-ancestors 'none'"
    );

    res.cookie('sessionID', '12345', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    next();
});


// Define your routes
app.get('/iframe-website1', (req, res) => {
    res.sendFile(__dirname + '/public/iframe-website1.html');
});

app.get('/iframe-website2', (req, res) => {
    res.sendFile(__dirname + '/public/iframe-website2.html');
});

const port = process.env.PORT || 5011;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});