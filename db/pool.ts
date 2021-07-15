import { Pool } from "pg";

let pool: Pool | undefined = undefined;

export const db = () => {
  if (pool !== undefined) {
    return pool;
  } else {
    const port = process.env.PG_PORT && parseInt(process.env.PG_PORT);
    const password = process.env.PG_PWD;
    const database = process.env.PG_DB;
    const host = process.env.PG_HOST;
    const user = process.env.PG_USER;

    if (!port || !password || !database || !host || !user) {
      throw new Error("Missing db config in env");
    }

    pool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });

    return pool;
  }
};
