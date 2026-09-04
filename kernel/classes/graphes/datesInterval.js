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
        return semaines;
    }

    prodsByWeeks(analyses,startedAt,endedAt) {
        const { getISOWeek } = require("date-fns");
        const prodsWeeks = this.weeks(startedAt,endedAt);
        const formattedAnalyses = this._formatElements(analyses);
        const differentProducts=[];
        for (const analyse of formattedAnalyses) {
            const weekNum = getISOWeek(analyse.createdAt).toString();

            if (prodsWeeks[weekNum]) {
                prodsWeeks[weekNum].analyses.push(analyse);
                prodsWeeks[weekNum].count++;
            }
            if(!differentProducts.includes(analyse.name)){differentProducts.push(analyse.name);}
        }

        return {differentProducts,prodsWeeks};
    }


// ====================== FONCTIONS UTILITAIRES ==============================================
    _formatElements(elements){
        if (!elements){alert('null or undefined'); return []};
        return Array.isArray(elements)?elements:Object.entries(elements);
    }

 }
 export default Interval;