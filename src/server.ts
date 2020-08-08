console.log('Hello World 2');

import express from 'express';

const app = express();

app.use(express.json());

app.get('/users', (request, response) => {

    console.log(request.query)

    const users = [
        { 'name': 'Alan' },
        { 'name': 'Carlos' }
    ];

    return response.json(users);
});

app.listen(3333);