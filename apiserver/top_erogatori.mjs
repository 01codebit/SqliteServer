import sqlite3 from 'sqlite3';
import { DB_PATH } from '../dbconnection/config.mjs';

const queryComunale = `select (meseAnnoVendita || fascia || selfService || tipoCarburante || codiceImpianto) AS _id, (selfService || tipoCarburante || codiceImpianto) AS IdErogatore, codiceImpianto AS CodiceImpianto, tipoCarburante AS TipoCarburante, selfService AS SelfService, meseAnnoVendita AS MeseAnnoVendita, meseVendita AS MeseVendita, annoVendita AS AnnoVendita, prezzoMin AS PrezzoMin, prezzoMax AS PrezzoMax, mediaConfronto AS MediaConfronto, Alarmed, (prezzoMin-mediaConfronto)/ mediaConfronto * 100 as PercMin, (prezzoMax-mediaConfronto)/ mediaConfronto * 100 as PercMax, fascia AS FasciaAllarme from ( select id,codiceImpianto, tipoCarburante, selfService, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, prezzoMax, mediaConfronto, Alarmed , fascia, pRif from ( select ROW_NUMBER() OVER(PARTITION BY fascia ORDER BY pMin asc) AS id, codiceImpianto, tipoCarburante, selfService, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, prezzoMax, mediaConfronto, 1 Alarmed , fascia, pMin as pRif from ( select b.idImpianto, b.gestoreImpianto, b.bandieraImpianto, b.codiceTipoImpianto, b.nomeImpianto, b.indirizzoImpianto, b.latitudineImpianto, b.longitudineImpianto, b.codiceComuneImpianto, b.comuneImpianto, b.codiceProvinciaImpianto, b.siglaProvinciaImpianto, b.codiceRegioneImpianto, prezziMensiliErogatori.fascia, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, prezzoMax, mediaConfronto, codiceImpianto, selfService, tipoCarburante, pMin, pMax from ( select codiceComuneImpianto, idimpianto as codiceImpianto, codiceTipoImpianto, tipoCarburante, isSelf as selfService, meseAnnoVendita, meseVendita, annoVendita, percimp, minprezzo as prezzoMin, maxprezzo as prezzoMax, mdnaz as mediaConfronto, abs(percimp) assoluto, case when percimp<-25 or pMin<-25 or pMax<-25 then 1 else 0 end fascia, pMin, pMax from ( select pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz, meseAnnoVendita, meseVendita, annoVendita, avg((prezzo-mdnaz)/ mdnaz * 100) percimp, (min(prezzo)-mdnaz)/ mdnaz * 100 as pMin, (max(prezzo)-mdnaz)/ mdnaz * 100 as pMax, min(prezzo) minprezzo, max(prezzo) maxprezzo from ( select idimpianto, isSelf isSelf, tipoCarburante tipoCarburante, codiceTipoImpianto codiceTipoImpianto, prezzo, mesevendita, annovendita, meseannovendita, codiceComuneImpianto codiceComuneImpianto from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) ) pr inner join ( select codiceComuneImpianto codiceComuneImpianto, tipoCarburante tipoCarburante, isSelf isSelf, codiceTipoImpianto, avg(prezzo) mdnaz from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) group by 1, 2, 3, 4 ) mnaz on pr.codiceComuneImpianto = mnaz.codiceComuneImpianto and pr.tipoCarburante = mnaz.tipoCarburante and pr.isSelf = mnaz.isSelf and pr.codiceTipoImpianto = mnaz.codiceTipoImpianto group by pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz ) tot ) prezziMensiliErogatori join anagraficaImpianti b on b.idImpianto = prezziMensiliErogatori.codiceImpianto  ) where fascia=1 order by pMin asc ) UNION select id,codiceImpianto, tipoCarburante, selfService, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, prezzoMax, mediaConfronto, Alarmed , fascia, pRif from ( select ROW_NUMBER() OVER(PARTITION BY fascia ORDER BY pMax desc) AS id, codiceImpianto, tipoCarburante, selfService, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, prezzoMax, mediaConfronto, 1 as Alarmed , fascia, pMax as pRif from ( select b.idImpianto, b.gestoreImpianto, b.bandieraImpianto, b.codiceTipoImpianto, b.nomeImpianto, b.indirizzoImpianto, b.latitudineImpianto, b.longitudineImpianto, b.codiceComuneImpianto, b.comuneImpianto, b.codiceProvinciaImpianto, b.siglaProvinciaImpianto, b.codiceRegioneImpianto, prezziMensiliErogatori.fascia, meseAnnoVendita, meseVendita, annoVendita, prezzoMin, prezzoMax, mediaConfronto, codiceImpianto, selfService, tipoCarburante, pMin,pMax from ( select codiceComuneImpianto, idimpianto as codiceImpianto, codiceTipoImpianto, tipoCarburante, isSelf as selfService, meseAnnoVendita, meseVendita, annoVendita, percimp, minprezzo as prezzoMin, maxprezzo as prezzoMax, mdnaz as mediaConfronto, abs(percimp) assoluto, case when percimp>25 or pMin>25 or pMax>25 then 2 else 0 end fascia, pMin,pMax from ( select pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz, meseAnnoVendita, meseVendita, annoVendita, avg((prezzo-mdnaz)/ mdnaz * 100) percimp, (min(prezzo)-mdnaz)/ mdnaz * 100 as pMin, (max(prezzo)-mdnaz)/ mdnaz * 100 as pMax, min(prezzo) minprezzo, max(prezzo) maxprezzo from ( select idimpianto, isSelf isSelf, tipoCarburante tipoCarburante, codiceTipoImpianto codiceTipoImpianto, prezzo, mesevendita, annovendita, meseannovendita, codiceComuneImpianto codiceComuneImpianto from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) ) pr inner join ( select codiceComuneImpianto codiceComuneImpianto, tipoCarburante tipoCarburante, isSelf isSelf, codiceTipoImpianto, avg(prezzo) mdnaz from "202112_day" where prezzo between 0.500 and 2.500 and isSelf in (0,1) and tipoCarburante in (0,1) and codiceTipoImpianto in (0,1,2) group by 1, 2, 3, 4 ) mnaz on pr.codiceComuneImpianto = mnaz.codiceComuneImpianto and pr.tipoCarburante = mnaz.tipoCarburante and pr.isSelf = mnaz.isSelf and pr.codiceTipoImpianto = mnaz.codiceTipoImpianto group by pr.codiceTipoImpianto, pr.codiceComuneImpianto, pr.idimpianto, pr.tipoCarburante, pr.isSelf, mdnaz ) tot ) prezziMensiliErogatori join anagraficaImpianti b on b.idImpianto = prezziMensiliErogatori.codiceImpianto  ) where fascia=2 order by pMax desc) ) where id <= 15 and fascia in (1,2);`;

export async function top_erogatori_route(req, res) {

    /* QUERY */
    let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('[top_erogatori_route] connection error: ' + err.message);
        }
        else {
            console.log('[top_erogatori_route] connected to the database.');
        }
    });

    let sql = queryComunale;
    //console.log("[top_erogatori_route] query: \"" + sql + "\"");

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.json({status:'error', msg: err.message});
        }
        // console.log("[top_erogatori_route] result: " + JSON.stringify(rows));
        console.log("[top_erogatori_route] found " + rows.length + " results");

        var topResult = {};
        var resultCount = 0;
        var keys = [];

        for (var i = 0; i < rows.length; i++)
        {
            var row = rows[i];
            var topListId = "" + row.FasciaAllarme + row.MeseAnnoVendita;
            var topList = {};
            if (topResult[topListId]) {
                topList = topResult[topListId];
            } else {
                resultCount++;
                keys.push(topListId);
            }
                
            topList._id = topListId;
            topList.MeseAnno = row.MeseAnnoVendita;
            topList.FasciaAllarme = row.FasciaAllarme;

            if (!topList.Erogatori)
                topList.Erogatori = [];
            
            topList.Erogatori.push(row);

            topResult[topListId] = (topList);
        }

        // _id string, Erogatori [], MeseAnno int, FasciaAllarme int
        // var topErogatori = {};
        // topErogatori._id = 0;
        // topErogatori.MeseAnno = 0;
        // topErogatori.FasciaAllarme = 0;
        // topErogatori.Erogatori = [];

        // if (rows.length > 0) {
        //     topErogatori.MeseAnno = rows[0].MeseAnno;
        //     topErogatori.FasciaAllarme = rows[0].FasciaAllarme;
        //     topErogatori._id = "" + rows[0].MeseAnnoVendita + rows[0].FasciaAllarme + rows[0].SelfService + rows[0].TipoCarburante + rows[0].CodiceImpianto;
        // }


        var topResultArray = [];
        for (var i = 0; i < keys.length; i++)
        {
            topResultArray.push(topResult[keys[i]]);    
        }

        var result = {};
        result.count = resultCount;
        result.response = topResultArray;

        return res.json(result);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('[top_erogatori_route] close the database connection.');
    });
}
