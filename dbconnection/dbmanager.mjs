import sqlite3 from 'sqlite3';
import { DB_PATH } from '../dbconnection/config.mjs';

var databaseIsOpen = false;
var database;
var connectionCount = 0;

export function getDatabase()
{
    if(!databaseIsOpen)
    {
        database = new sqlite3.cached.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error('[dbmanager.getDatabase] connection error: ' + err.message);
                return null;
            }
            else {
                console.log('[dbmanager.getDatabase] connected to the database');
                databaseIsOpen = true;
            }
        });
    }

    connectionCount++;
    console.log('[dbmanager.getDatabase] connection count: ' + connectionCount);

    return database;
}

export function closeConnection()
{
    connectionCount--;
    console.log('[dbmanager.closeConnection] connection count: ' + connectionCount);

    if(connectionCount==0)
    {
        database.close((err) => {
            if (err) {
                console.error(err.message);
            }
            else {
                console.log('[dbmanager.closeConnection] database closed');
                databaseIsOpen = false;
            }
        });
    }
}