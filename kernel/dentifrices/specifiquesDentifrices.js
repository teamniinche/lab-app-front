import dentifriceResults from "./dentifriceStrategy";
// import liquidProducts from "../../assets/liquidesNormes";
// const dentifrices=liquidProducts.dentifrice;

export class dentifriceBlancResults extends dentifriceResults{
    
    dentifrices;
    constructor(dentifrices){
        super();
        this.dentifrices=dentifrices;
    }

    Color(){
        return this.dentifrices.codor_normes.color.blanc;
        // dentifrices.codor_normes.color.rouge;
    }

    Viscosite(){
        return this.dentifrices.viscosite_normes.blanc;
        // dentifrices.viscosite_normes.rouge;
    }

    Results(nom="mera blanc"){
        return {
            ...this.dentifrices,
            codor_normes:{
                ...this.dentifrices.codor_normes,
                color:this.Color(),
                nom:nom && nom,
                categorie:'dentifrice',
            },
            viscosite_normes:this.Viscosite(),

        }
    }
}

export class dentifriceRougeResults extends dentifriceResults{
   dentifrices;
    constructor(dentifrices){
        super();
        this.dentifrices=dentifrices;
    }

    Color(){
        return this.dentifrices.codor_normes.color.rouge;
        // dentifrices.codor_normes.color.rouge;
    }

    Viscosite(){
        return this.dentifrices.viscosite_normes.rouge;
        // dentifrices.viscosite_normes.rouge;
    }

    Results(nom="mera rouge"){
        return {
            ...this.dentifrices,
            codor_normes:{
                ...this.dentifrices.codor_normes,
                color:this.Color(),
                nom:nom && nom,
                categorie:'dentifrice',
            },
            viscosite_normes:this.Viscosite(),

        }
    }
}

export class dentifriceNoirResults extends dentifriceResults{
   dentifrices;
    constructor(dentifrices){
        super();
        this.dentifrices=dentifrices;
    }

    Color(){
        return this.dentifrices.codor_normes.color.noir
        // dentifrices.codor_normes.color.noir;
    }

    Viscosite(){
        return this.dentifrices.viscosite_normes.noir;
        // dentifrices.viscosite_normes.noir;
    }

    Results(nom="mera noir"){
        return {
            ...this.dentifrices,
            codor_normes:{
                ...this.dentifrices.codor_normes,
                color:this.Color(),
                nom:nom && nom,
                categorie:'dentifrice',
            },
            viscosite_normes:this.Viscosite(),

        }
    }
}

export class dentifriceBleuResults extends dentifriceResults{
   dentifrices;
    constructor(dentifrices){
        super();
        this.dentifrices=dentifrices;
    }

    Color(){
        return this.dentifrices.codor_normes.color.bleu
        // dentifrices.codor_normes.color.bleu;
    }

    Viscosite(){
        return this.dentifrices.viscosite_normes.bleu;
        // dentifrices.viscosite_normes.bleu;
    }

    Results(nom="mera bleu"){
        return {
            ...this.dentifrices,
            codor_normes:{
                ...this.dentifrices.codor_normes,
                color:this.Color(),
                nom:nom && nom,
                categorie:'dentifrice',
            },
            viscosite_normes:this.Viscosite(),

        }
    }

}