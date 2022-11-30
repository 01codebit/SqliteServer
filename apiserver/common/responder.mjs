import { closeDB, readAllByQuery } from '../../dbconnection/db_sqlite3.mjs';

export async function getDataAndRespond(caller, sql, res, start) {
    let result = {};
    await readAllByQuery(sql)
        .then(rows => {        
            result.count = rows.length;
            result.response = rows;
        })
        .catch(err => {
            console.log('[' + caller + '] ***ERROR*** err: ' + err);

            result.count = 0;
            result.response = {'error': 'err.message'};

        })
        .finally(() => {
            // console.log('[' + caller + '] close db');
            // closeDB();

            let elapsed = Date.now() - start;
            console.log('[' + caller + '] time elapsed: ' + elapsed / 1000 + 's');

            console.log('[' + caller + '] result count: ' + result.count);
            return res.json(result);
        }
    )
}