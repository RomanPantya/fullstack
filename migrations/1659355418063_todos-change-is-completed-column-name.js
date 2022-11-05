/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async pgm => {
    await pgm.sql(`
        alter table todos
        rename column iscomplete to is_completed;
    `)
};

exports.down = pgm => {};
