import { getDatabase, closeConnection } from '../dbconnection/dbmanager.mjs';

const queryComunale = `select meseAnnoVendita AS _id, meseAnnoVendita AS MeseAnnoVendita, count(*) as Totali, SUM(case when Alarmed = 1 then 1 else 0 end) as TotaliAlarmed, SUM(case when tipoCarburante = 0 then 1 else 0 end) as BenzinaTotali, SUM(case when tipoCarburante = 0 and Alarmed = 1 then 1 else 0 end) as BenzinaAlarmed, SUM(case when tipoCarburante = 1 then 1 else 0 end) as GasolioTotali, SUM(case when tipoCarburante = 1 and Alarmed = 1 then 1 else 0 end) as GasolioAlarmed, SUM(case when selfService = 1 then 1 else 0 end) as SelfTotali, SUM(case when selfService = 1 and Alarmed = 1 then 1 else 0 end) as SelfAlarmed, SUM(case when selfService = 0 then 1 else 0 end) as ServitoTotali, SUM(case when selfService = 0 and Alarmed = 1 then 1 else 0 end) as ServitoAlarmed from ( select ROW_NUMBER() OVER( ORDER BY codiceImpianto) AS id, codiceImpianto, tipoCarburante, selfService, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, mediaConfronto, (mediaConfronto - prezzoMin) as deltaMedia, (CASE when fascia in (1,2) then 1 else 0 end) as Alarmed from ( select b.idImpianto, b.gestoreImpianto, b.bandieraImpianto, b.codiceTipoImpianto, b.nomeImpianto, b.indirizzoImpianto, b.latitudineImpianto, b.longitudineImpianto, b.codiceComuneImpianto, b.comuneImpianto, b.codiceProvinciaImpianto, b.siglaProvinciaImpianto, b.codiceRegioneImpianto, prezziMensiliErogatori.fascia, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, mediaConfronto, codiceImpianto, selfService, tipoCarburante from ( select codiceComuneImpianto, idimpianto as codiceImpianto, codiceTipoImpianto, tipoCarburante, isSelf as selfService, meseAnnoVendita, meseVendita, annoVendita, percimp, minprezzo as prezzoMin, maxprezzo, mdnaz as mediaConfronto, abs(percimp) assoluto, case when percimp<-25 or pMin<-25 or pMax<-25 then 1 when percimp>25 or pMin>25 or pMax>25 then 2 when (percimp<-25 or pMin<-25 or pMax<-25) and (percimp>25 or pMin>25 or pMax>25) then 3 else 0 end fascia from ( select pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz, meseAnnoVendita, meseVendita, annoVendita, avg((prezzo-mdnaz)/ mdnaz * 100) percimp, (min(prezzo)-mdnaz)/ mdnaz * 100 as pMin, (max(prezzo)-mdnaz)/ mdnaz * 100 as pMax, min(prezzo) minprezzo, max(prezzo) maxprezzo from ( select idimpianto, isSelf isSelf, tipoCarburante tipoCarburante, codiceTipoImpianto codiceTipoImpianto, prezzo, mesevendita, annovendita, meseannovendita, codiceComuneImpianto codiceComuneImpianto from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) ) pr inner join ( select codiceComuneImpianto codiceComuneImpianto, tipoCarburante tipoCarburante, isSelf isSelf, codiceTipoImpianto, avg(prezzo) mdnaz from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) group by 1, 2, 3 , 4 ) mnaz on pr.codiceComuneImpianto = mnaz.codiceComuneImpianto and pr.tipoCarburante = mnaz.tipoCarburante and pr.isSelf = mnaz.isSelf and pr.codiceTipoImpianto = mnaz.codiceTipoImpianto group by pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz, meseAnnoVendita, meseVendita, annoVendita ) tot ) prezziMensiliErogatori join anagraficaImpianti b on b.idImpianto = prezziMensiliErogatori.codiceImpianto  ) tt ) tot group by meseAnnoVendita;`;

export async function erogatori_stats_route(req, res) {

    let start = Date.now();

    /* GET CONNECTION */
    let db = getDatabase();

    /* QUERY */
    let sql = queryComunale;
    //console.log("[erogatori_stats_route] query: \"" + sql + "\"");

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.json({status:'error', msg: err.message});
        }
        // console.log("[erogatori_stats_route] result: " + JSON.stringify(rows));
        console.log("[erogatori_stats_route] found " + rows.length + " results");

        let result = {};
        result.count = rows.length;
        result.response = rows;

        return res.json(result);
    });

    /* CLOSE CONNECTION */
    closeConnection();

    let elapsed = Date.now() - start;
    console.log('[erogatori_stats_route] close the database connection (time elapsed: ' + elapsed/1000 + ' s)');
}
