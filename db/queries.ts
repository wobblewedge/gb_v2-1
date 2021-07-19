import type { Musing } from "./types";
import { db } from "./pool";
import { customAlphabet } from "nanoid";

export const getAllMusings = async (): Promise<Array<Musing>> =>
  await new Promise(function (resolve, reject) {
    db().query("SELECT * FROM musings", (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows);
    });
  });

export const createNewMusing = async (
  title: string,
  musing: string
): Promise<Musing> =>
  await new Promise(function (resolve, reject) {
    db().query(
      `INSERT INTO musings (id, title, musing) VALUES ('${createId()}', '${title}', '${musing}') RETURNING id, title, musing`,
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result.rows[0]);
      }
    );
  });

export const updateMusing = async (
  id: string,
  title: string,
  musing: string
): Promise<Musing> =>
  await new Promise(function (resolve, reject) {
    db().query(
      `UPDATE musings SET title = '${title}', musing = '${musing}' WHERE id = '${id}' RETURNING id, title, musing`,
      (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result.rows[0]);
      }
    );
  });

export const deleteMusing = async (id: string): Promise<void> =>
  await new Promise(function (resolve, reject) {
    db().query(`DELETE from musings WHERE id = '${id}'`, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });

const createId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  9
);
