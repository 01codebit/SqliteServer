import sqlite3 from 'sqlite3';
import { DB_PATH } from '../dbconnection/config.mjs';

import DBG from 'debug';

const debug = DBG('sqliteserver:db_sqlite3');
const error = DBG('sqliteserver:error-db_sqlite3');

var db; // database connection

async function connectDB()
{
    if (db) return db;

    console.log("Open database file: " + DB_PATH);
    await new Promise((resolve, reject) => {
        db = new sqlite3.cached.Database(DB_PATH, sqlite3.OPEN_READONLY, err => {
            if (err) {
                console.log("error opening database: " + err);
                return reject(err);
            }
            resolve(db);
        });
    });

    return db;
}

export async function readAllByQuery(query)
{
    var db = await connectDB();
    
    // var data = await new Promise((resolve, reject) => {
    //     db.all(query, [], (err, row) => {
    //         if (err) {
    //             console.log(err.message)
    //             return reject(err);
    //         }
    //         resolve(row);
    //     })
    // });
    
    // return data;
}

export async function closeDB()
{
    var _db = db;
    db = undefined;
    console.log("close database");
    return _db ? new Promise((resolve, reject) => {
        _db.close(err => {
            if (err) reject(err);
            else resolve();
        })
    }) : undefined;
}