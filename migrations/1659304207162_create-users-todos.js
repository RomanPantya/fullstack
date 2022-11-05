/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async pgm => {
    await pgm.sql(`
        create table users(
            id serial primary key,
            name varchar,
            password varchar,
            email VARCHAR UNIQUE
        );
        `);
    await pgm.sql(`
        create table todos(
            id serial primary key,
            user_Id integer,
            foreign key(user_id) references users(id),
            title varchar,
            isComplete bool
        );
        `);
};

exports.down = async pgm => {
    await pgm.sql(`
        drop table users;
    `);
    await pgm.sql(`
        drop table todos;
    `);
};
