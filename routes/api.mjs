import express from 'express';

/* APIs functions */
import { region_route } from '../apiserver/regioni.mjs';
import { prov_route } from '../apiserver/province.mjs';
import { com_route } from '../apiserver/comuni.mjs';
import { flag_route } from '../apiserver/bandiere.mjs';

import { impianti_route } from '../apiserver/impianti.mjs';
import { erogatori_route } from '../apiserver/erogatori.mjs';
import { impianti_stats_route } from '../apiserver/impianti_stats.mjs';
import { top_erogatori_route } from '../apiserver/top_erogatori.mjs';
import { erogatori_stats_route } from '../apiserver/erogatori_stats.mjs';


export const router = express.Router();


/* APIs routes */
router.use('/regioni', region_route);
router.use('/province', prov_route);
router.use('/comuni', com_route);
router.use('/bandiere', flag_route);

router.use('/impianti', impianti_route);
router.use('/erogatori', erogatori_route);
router.use('/impianti-stats', impianti_stats_route);
router.use('/top-erogatori', top_erogatori_route);
router.use('/erogatori-stats', erogatori_stats_route);
