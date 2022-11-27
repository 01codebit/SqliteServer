import { getDatabase, closeConnection } from '../dbconnection/dbmanager.mjs';

export async function flag_route(req, res) {

    let start = Date.now();

    /* GET CONNECTION */
    let db = getDatabase();

    /* QUERY */
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

    /* CLOSE CONNECTION */
    closeConnection();

    let elapsed = Date.now() - start;
    console.log('[flag_route] close the database connection (time elapsed: ' + elapsed/1000 + ' s)');
}