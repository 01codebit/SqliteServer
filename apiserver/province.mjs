import sqlite3 from 'sqlite3';
import { DB_PATH } from '../dbconnection/config.mjs';

export async function prov_route(req, res) {

    /* QUERY */
    let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('[prov_route] connection error: ' + err.message);
        }
        else {
            console.log('[prov_route] connected to the database.');
        }
    });

    let sql = `SELECT CAST(idProvincia AS varchar) AS _id, descrizioneProvincia AS Description, regioneProvincia AS CodiceRegione FROM province;`;
    console.error("[prov_route] query: \"" + sql + "\"");

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.json({status:'error', msg: err.message});
        }
        // console.error("[prov_route] result: " + JSON.stringify(rows));
        console.error("[prov_route] found " + rows.length + " results");

        let result = {};
        result.count = rows.length;
        result.response = rows;

        return res.json(result);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('[prov_route] close the database connection.');
    });
}
