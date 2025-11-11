import pgPromise from "pg-promise";

const pgp = pgPromise();

const db = pgp({
  host: "localhost",
  port: 5432,
  database: "chaten",
  user: "postgres",
  password: "12345678"
});

  const listener = pgp({
  host: 'localhost',
  port: 5432,
  database:  'chaten',
  user: 'postgres',
  password:  '12345678',
});

export { db, listener };
export default db;