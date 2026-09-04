class Interval{

    constructor(){}

    weeks(startedAt,endedAt){
        const {getISOWeek, differenceInCalendarISOWeeks } = require("date-fns");
        const ns=Math.abs(differenceInCalendarISOWeeks(startedAt,endedAt))+1;
        const startedWeek=getISOWeek(startedAt);
        // const endedWeek=getISOWeek(this.endedAt);
        const semaines = Object.fromEntries(
            Array.from({ length: ns }, (_, i) => [i + startedWeek, { analyses: [], count: 0 }])
        );
console.log('semaines',semaines);
        return semaines;
    }

    prodsByWeeks(analyses,startedAt,endedAt) {
        const { getISOWeek } = require("date-fns");
        const prodsWeeks = this.weeks(startedAt,endedAt);
        const formattedAnalyses = this._formatElements(analyses);
        for (const analyse of formattedAnalyses) {
            const weekNum = getISOWeek(analyse.createdAt).toString();
console.log('weekNum',weekNum);

            if (prodsWeeks[weekNum]) {
                console.log('in');
                prodsWeeks[weekNum].analyses.push(analyse);
                prodsWeeks[weekNum].count++;
            }
        }

        return prodsWeeks;
    }


// ====================== FONCTIONS UTILITAIRES ==============================================
    _formatElements(elements){
        if (!elements){alert('null or undefined'); return []};
        return Array.isArray(elements)?elements:Object.entries(elements);
    }

 }
 export default Interval;