import sqlite3 from 'sqlite3';
import { DB_PATH } from '../dbconnection/config.mjs';

export async function com_route(req, res) {

    /* QUERY */
    let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('[com_route] connection error: ' + err.message);
        }
        else {
            console.log('[com_route] connected to the database.');
        }
    });

    let sql = `SELECT CAST(istat AS varchar) AS _id, descrizioneComune AS Description, regioneComune AS CodiceRegione, provinciaComune AS CodiceProvincia FROM comuni;`;
    //console.log("[com_route] query: \"" + sql + "\"");

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.json({status:'error', msg: err.message});
        }
        // console.log("[com_route] result: " + JSON.stringify(rows));
        console.log("[com_route] found " + rows.length + " results");

        let result = {};
        result.count = rows.length;
        result.response = rows;

        return res.json(result);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('[com_route] close the database connection.');
    });
}
