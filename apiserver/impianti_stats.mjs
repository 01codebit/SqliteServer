import sqlite3 from 'sqlite3';
import { DB_PATH } from '../dbconnection/config.mjs';

const queryComunale = `select meseAnnoVendita AS _id, meseAnnoVendita, count() as Totali, SUM(case when Alarmed >0 then 1 else 0 end) as TotaliAlarmed, SUM(case when codiceTipoImpianto = 2 then 1 else 0 end) as AutostradaliTotali, SUM(case when codiceTipoImpianto = 2 and Alarmed > 0 then 1 else 0 end) as AutostradaliAlarmed,SUM(case when codiceTipoImpianto = 1 then 1 else 0 end) as StradeStataliTotali, SUM(case when codiceTipoImpianto = 1 and Alarmed > 0 then 1 else 0 end) as StradeStataliAlarmed, SUM(case when codiceTipoImpianto = 0 then 1 else 0 end) as AltroTotali, SUM(case when codiceTipoImpianto = 0 and Alarmed > 0 then 1 else 0 end) as AltroAlarmed, SUM(AlarmedDown) AlarmedDown, SUM(AlarmedUP) AlarmedUP from ( select idImpianto, gestoreImpianto, bandieraImpianto, codiceTipoImpianto, nomeImpianto, indirizzoImpianto, latitudineImpianto, longitudineImpianto, codiceComuneImpianto, comuneImpianto, codiceProvinciaImpianto, siglaProvinciaImpianto, codiceRegioneImpianto, meseAnnoVendita, fascia, count() as ErogatoriImpianto, SUM (CASE when fascia in (1,2) then 1 else 0 end) as Alarmed, SUM (CASE when fascia in (1) then 1 else 0 end) as AlarmedDown, SUM (CASE when fascia in (2) then 1 else 0 end) as AlarmedUp from ( select b.idImpianto, b.gestoreImpianto, b.bandieraImpianto, b.codiceTipoImpianto, b.nomeImpianto, b.indirizzoImpianto, b.latitudineImpianto, b.longitudineImpianto, b.codiceComuneImpianto, b.comuneImpianto, b.codiceProvinciaImpianto, b.siglaProvinciaImpianto, b.codiceRegioneImpianto, prezziMensiliErogatori.fascia, meseAnnoVendita, meseVendita, annoVendita, codiceImpianto from ( select distinct codiceComuneImpianto, codiceImpianto, meseAnnoVendita, meseVendita, annoVendita, fascia from ( select codiceComuneImpianto, idimpianto as codiceImpianto, codiceTipoImpianto, meseAnnoVendita, meseVendita, annoVendita, percimp, minprezzo as prezzoMin, maxprezzo, mdnaz as mediaConfronto, abs(percimp) assoluto, case when percimp<-25 or pMin<-25 or pMax<-25 then 1 when percimp>25 or pMin>25 or pMax>25 then 2 when (percimp<-25 or pMin<-25 or pMax<-25) and (percimp>25 or pMin>25 or pMax>25) then 3 else 0 end fascia from ( select pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz, meseAnnoVendita, meseVendita, annoVendita, avg((prezzo-mdnaz)/ mdnaz * 100) percimp, (min(prezzo)-mdnaz)/ mdnaz * 100 as pMin, (max(prezzo)-mdnaz)/ mdnaz * 100 as pMax, min(prezzo) minprezzo, max(prezzo) maxprezzo from ( select idimpianto, isSelf isSelf, tipoCarburante tipoCarburante, codiceTipoImpianto codiceTipoImpianto, prezzo, mesevendita, annovendita, codiceComuneImpianto codiceComuneImpianto, meseAnnoVendita from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) ) pr inner join ( select codiceComuneImpianto codiceComuneImpianto, tipoCarburante tipoCarburante, isSelf isSelf, codiceTipoImpianto, avg(prezzo) mdnaz from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) group by 1, 2, 3 , 4 ) mnaz on pr.tipoCarburante = mnaz.tipoCarburante and pr.codiceComuneImpianto = mnaz.codiceComuneImpianto and pr.isSelf = mnaz.isSelf and pr.codiceTipoImpianto = mnaz.codiceTipoImpianto group by pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz) tot )) prezziMensiliErogatori join anagraficaImpianti b on b.idImpianto = prezziMensiliErogatori.codiceImpianto )  group by IdImpianto, meseAnnoVendita) group by meseAnnoVendita;`;

export async function impianti_stats_route(req, res) {

    /* QUERY */
    let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('[impianti_stats_route] connection error: ' + err.message);
        }
        else {
            console.log('[impianti_stats_route] connected to the database.');
        }
    });

    let sql = queryComunale;
    console.error("[impianti_stats_route] query: \"" + sql + "\"");

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.json({status:'error', msg: err.message});
        }
        // console.error("[impianti_stats_route] result: " + JSON.stringify(rows));
        console.error("[impianti_stats_route] found " + rows.length + " results");

        let result = {};
        result.count = rows.length;
        result.response = rows;

        return res.json(result);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('[impianti_stats_route] close the database connection.');
    });
}
