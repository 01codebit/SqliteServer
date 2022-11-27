import { getDatabase, closeConnection } from '../dbconnection/dbmanager.mjs';

export async function com_route(req, res) {

    let start = Date.now();

    /* GET CONNECTION */
    let db = getDatabase();

    /* QUERY */
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
    });


    /* CLOSE CONNECTION */
    closeConnection();

    let elapsed = Date.now() - start;
    console.log('[com_route] close the database connection (time elapsed: ' + elapsed/1000 + ' s)');
}
