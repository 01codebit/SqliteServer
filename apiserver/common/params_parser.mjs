export async function parseParams(req, baseQuery) {

    /* PARAM: LIMIT */
    let limit = req.body.limit;
    if (limit) {
        console.log("[impianti_route] PARAMS limit: " + limit)
        baseQuery = baseQuery.replace("[LIMIT]", "limit " + limit);
    }
    else {
        baseQuery = baseQuery.replace("[LIMIT]", "");
    }

    /* PARAM: QUERY */
    let query = req.body.query;
    if (query) {
        console.log("[impianti_route] PARAMS query: " + query)
        // TODO: applicare i filtri definiti dal campo 'query'
        // ...
    }
    else {
        // ...
    }

    return baseQuery;
}