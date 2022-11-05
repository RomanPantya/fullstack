const express = require('express');
const { Client } = require('pg');
const { config } = require('dotenv');
const qs = require('qs');
const renders = require('./renders');
config();
const connecting = new Client(process.env.DATABASE_URL);
connecting.connect();
const app = express();

app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('home', {
        todos: req.query.todos || [],
        userId: req.query.userId,
     });
});

app.get('/sign-up', (req, res) => {
     res.render('sign-up');
});

app.post('/api/sign-up', async (req, res) => {
    console.log(req.body);
    const { name, password, email } = req.body;

    const { rows: [{ id }] } = await connecting.query(`
        insert into users(
            name,
            password,
            email)
            values($1, $2, $3)
            returning id`,
            [name, password, email]);

        res.redirect('/' + qs.stringify({ userId: id }, { addQueryPrefix: true }));
});

app.post('/api/create-todo', async (req, res) => {
    const { title, user_id } = req.body;
    const userId = +user_id;
    console.log(userId);
    await connecting.query(`
        insert into todos(
            title,
            user_id,
            is_completed
        )
        values(
            $1,
            $2,
            $3
        );
    `, [title, userId, false]);
    const { rows: todos } = await connecting.query(`
        select title, is_completed from todos
        where user_id = $1;
    `, [userId]);
    console.log(todos);


    renders.home(res, {
        todos,
        userId,
    });
})















app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
