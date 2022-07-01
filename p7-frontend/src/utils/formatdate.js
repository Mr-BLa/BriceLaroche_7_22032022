/** GESTION FORMAT DATE / LUXON **/

import { DateTime } from "luxon"




function formatDate(dateISO) {

    const dt = DateTime.fromISO(dateISO);

    return dt.setLocale("fr").toLocaleString(DateTime.DATE_SHORT);
}

export default formatDate