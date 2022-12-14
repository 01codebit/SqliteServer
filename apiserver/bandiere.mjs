import sqlite3 from 'sqlite3';
import { DB_PATH } from '../dbconnection/config.mjs';

export async function flag_route(req, res) {

    let start = Date.now();

    /* QUERY */
    let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('[flag_route] connection error: ' + err.message);
        }
        else {
            console.log('[flag_route] connected to the database');
        }
    });

    let sql = `SELECT bandieraImpianto AS _id, bandieraImpianto AS Description FROM anagraficaimpianti GROUP BY bandieraImpianto;`;
    //console.log("[flag_route] query: \"" + sql + "\"");

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.json({status:'error', msg: err.message});
        }
        // console.log("[flag_route] result: " + JSON.stringify(rows));
        console.log("[flag_route] found " + rows.length + " results");

        let result = {};
        result.count = rows.length;
        result.response = rows;

        return res.json(result);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        let elapsed = Date.now() - start;
        console.log('[flag_route] close the database connection (time elapsed: ' + elapsed/1000 + ' s)');
    });
}