import cosmetiquesResults from "./cosmetiqueStrategy";
// import liquidProducts from "../../assets/liquidesNormes";
// const {
//     noura_net,
//     lave_main_madar,
//     lave_main_noura,
//     matiz_savon_liquide,
//     supermore
// }=liquidProducts;

// =================== NOURA NET ===============================
class nouraNetJauneResults extends cosmetiquesResults{
    noura_net;
    constructor(nouraNet){
        super();
        this.noura_net=nouraNet;
    }
    Color(){return this.noura_net.codor_normes.color.citron;}
    Parfum(){return this.noura_net.codor_normes.parfum.jaune;}
    Results(){
        return {
            ...this.noura_net,
            codor_normes:{
                ...this.noura_net.codor_normes,
                color:this.Color(this.noura_net),
                parfum:this.Parfum(this.noura_net),
                nom:'Noura net '+this.Parfum(this.noura_net)
            }
        }
    }
}
class nouraNetRoseResults extends cosmetiquesResults{
    noura_net;
    constructor(nouraNet){
        super();
     this.noura_net=nouraNet;
    }
    Color(){return this.noura_net.codor_normes.color.flamboise;}
    Parfum(){return this.noura_net.codor_normes.parfum.rouge;}
    Results(){
        return {
            ...this.noura_net,
            codor_normes:{
                ...this.noura_net.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Noura net '+this.Parfum()
            }
        }
    }
}
class nouraNetFlamboiseResults extends cosmetiquesResults{
    noura_net;
    constructor(nouraNet){
        super();
     this.noura_net=nouraNet;
    }
    Color(){return this.noura_net.codor_normes.color.citron;}
    Parfum(){return this.noura_net.codor_normes.parfum.jaune; }
    Results(){
        return {
            ...this.noura_net,
            codor_normes:{
                ...this.noura_net.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Noura net '+this.Parfum()
            }
        }
    }
}
class nouraNetVioletResults extends cosmetiquesResults{
    noura_net;
    constructor(nouraNet){
        super();
     this.noura_net=nouraNet;
    }
    Color(){return this.noura_net.codor_normes.color.lavander;}
    Parfum(){return this.noura_net.codor_normes.parfum.violet; }
    Results(){
        return {
            ...this.noura_net,
            codor_normes:{
                ...this.noura_net.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Noura net '+this.Parfum()
            }
        }
    }
}
class nouraNetVertResults extends cosmetiquesResults{
    noura_net;
    constructor(nouraNet){
        super();
     this.noura_net=nouraNet;
    }
    Color(){return this.noura_net.codor_normes.color.fama;}
    Parfum(){return this.noura_net.codor_normes.parfum.vert; }
    Results(){
        return {
            ...this.noura_net,
            codor_normes:{
                ...this.noura_net.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Noura net '+this.Parfum()
            }
        }
    }
}
export const nouraNetResults={
    nJaune:nouraNetJauneResults,
    nRose:nouraNetRoseResults,
    flamboise:nouraNetFlamboiseResults,
    nViolet:nouraNetVioletResults,
    nVert:nouraNetVertResults
}

// =================== LAVE MAINS MADAR ===============================
class lmMadarRougeResults extends cosmetiquesResults{
    lave_main_madar;
    constructor(laveMainMadar){
        super();
        this.lave_main_madar=laveMainMadar;
    }
    Color(){return this.lave_main_madar.codor_normes.color.rouge;}
    Parfum(){return this.lave_main_madar.codor_normes.parfum.rouge;}
    Results(){
        return {
            ...this.lave_main_madar,
            codor_normes:{
                ...this.lave_main_madar.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Madar '+this.Parfum()
            }
        }
    }
}
class lmMadarMarronResults extends cosmetiquesResults{
    lave_main_madar;
    constructor(laveMainMadar){
        super();
        this.lave_main_madar=laveMainMadar;
    }
    Color(){return this.lave_main_madar.codor_normes.color.marron;}
    Parfum(){return this.lave_main_madar.codor_normes.parfum.marron;}
    Results(){
        return {
            ...this.lave_main_madar,
            codor_normes:{
                ...this.lave_main_madar.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Madar '+this.Parfum()
            }
        }
    }
}
class lmMadarBlancResults extends cosmetiquesResults{
    lave_main_madar;
    constructor(laveMainMadar){
        super();
        this.lave_main_madar=laveMainMadar;
    }
    Color(){return this.lave_main_madar.codor_normes.color.blanc;}
    Parfum(){return this.lave_main_madar.codor_normes.parfum.blanc; }
    Results(){
        return {
            ...this.lave_main_madar,
            codor_normes:{
                ...this.lave_main_madar.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Madar '+this.Parfum()
            }
        }
    }
}
class lmMadarOrangeResults extends cosmetiquesResults{
    lave_main_madar;
    constructor(laveMainMadar){
        super();
        this.lave_main_madar=laveMainMadar;
    }
    Color(){return this.lave_main_madar.codor_normes.color.orange;}
    Parfum(){return this.lave_main_madar.codor_normes.parfum.orange; }
    Results(){
        return {
            ...this.lave_main_madar,
            codor_normes:{
                ...this.lave_main_madar.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Madar '+this.Parfum()
            }
        }
    }
}
class lmMadarJauneResults extends cosmetiquesResults{
    lave_main_madar;
    constructor(laveMainMadar){
        super();
        this.lave_main_madar=laveMainMadar;
    }
    Color(){return this.lave_main_madar.codor_normes.color.jaune;}
    Parfum(){return this.lave_main_madar.codor_normes.parfum.jaune; }
    Results(){
        return {
            ...this.lave_main_madar,
            codor_normes:{
                ...this.lave_main_madar.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Madar '+this.Parfum()
            }
        }
    }
}
export const lmMadarResults={
    rouge:lmMadarRougeResults,
    marron:lmMadarMarronResults,
    blanc:lmMadarBlancResults,
    orange:lmMadarOrangeResults,
    jaune:lmMadarJauneResults
}

// =================== LAVE MAINS NOURA ===============================
class lmNouraRoseResults extends cosmetiquesResults{
    lave_main_noura;
    constructor(laveMainNoura){
        super();
        this.lave_main_noura=laveMainNoura;
    }
    Color(){return this.lave_main_noura.codor_normes.color.rose;}
    Parfum(){return this.lave_main_noura.codor_normes.parfum.rose; }
    Results(){
        return {
            ...this.lave_main_noura,
            codor_normes:{
                ...this.lave_main_noura.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Noura '+this.Parfum()
            }
        }
    }
}
class lmNouraRougeResults extends cosmetiquesResults{
    lave_main_noura;
    constructor(laveMainNoura){
        super();
        this.lave_main_noura=laveMainNoura;
    }
    Color(){return this.lave_main_noura.codor_normes.color.fraise;}
    Parfum(){return this.lave_main_noura.codor_normes.parfum.rouge;}
    Results(){
        return {
            ...this.lave_main_noura,
            codor_normes:{
                ...this.lave_main_noura.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Noura '+this.Parfum()
            }
        }
    }
}
class lmNouraVioletResults extends cosmetiquesResults{
    lave_main_noura;
    constructor(laveMainNoura){
        super();
        this.lave_main_noura=laveMainNoura;
    }
    Color(){return this.lave_main_noura.codor_normes.color.lavander;}
    Parfum(){return this.lave_main_noura.codor_normes.parfum.violet; }
    Results(){
        return {
            ...this.lave_main_noura,
            codor_normes:{
                ...this.lave_main_noura.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Noura '+this.Parfum()
            }
        }
    }
}
class lmNouraVertResults extends cosmetiquesResults{
    lave_main_noura;
    constructor(laveMainNoura){
        super();
        this.lave_main_noura=laveMainNoura;
    }
    Color(){return this.lave_main_noura.codor_normes.color.pomme;}
    Parfum(){return this.lave_main_noura.codor_normes.parfum.vert; }
    Results(){
        return {
            ...this.lave_main_noura,
            codor_normes:{
                ...this.lave_main_noura.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Noura '+this.Parfum()
            }
        }
    }
}
class lmNouraBlancResults extends cosmetiquesResults{
    lave_main_noura;
    constructor(laveMainNoura){
        super();
        this.lave_main_noura=laveMainNoura;
    }
    Color(){return this.lave_main_noura.codor_normes.color.marseille;}
    Parfum(){return this.lave_main_noura.codor_normes.parfum.blanc; }
    Results(){
        return {
            ...this.lave_main_noura,
            codor_normes:{
                ...this.lave_main_noura.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'LM Noura '+this.Parfum()
            }
        }
    }
}
export const lmNouraResults={
    rose:lmNouraRoseResults,
    rouge:lmNouraRougeResults,
    violet:lmNouraVioletResults,
    vert:lmNouraVertResults,
    nrBlanc:lmNouraBlancResults
}

// =================== MATIZ SAVON LIQUIDE ===============================
class matizRoseResults extends cosmetiquesResults{
    matiz_savon_liquide;
    constructor(matizSavonLiquide){
        super();
        this.matiz_savon_liquide=matizSavonLiquide;
    }
    Color(){return this.matiz_savon_liquide.codor_normes.color.rose;}
    Parfum(){return this.matiz_savon_liquide.codor_normes.parfum.rose; }
    Results(){
        return {
            ...this.matiz_savon_liquide,
            codor_normes:{
                ...this.matiz_savon_liquide.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Matiz '+this.Parfum()
            }
        }
    }
}
class matizVertResults extends cosmetiquesResults{
    matiz_savon_liquide;
    constructor(matizSavonLiquide){
        super();
        this.matiz_savon_liquide=matizSavonLiquide;
    }
    Color(){return this.matiz_savon_liquide.codor_normes.color.vert;}
    Parfum(){return this.matiz_savon_liquide.codor_normes.parfum.vert;}
    Results(){
        return {
            ...this.matiz_savon_liquide,
            codor_normes:{
                ...this.matiz_savon_liquide.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Matiz '+this.Parfum()
            }
        }
    }
}
export const matizResults={
    mtzRose:matizRoseResults,
    mtzVert:matizVertResults
}

// =================== SUPER MORE ===============================
class desoPresiosoResults extends cosmetiquesResults{
    supermore;
    constructor(superMore){
        super();
        this.supermore=superMore;
    }
    Color(){return this.supermore.codor_normes.color.presioso;}
    Parfum(){return this.supermore.codor_normes.parfum.presioso; }
    Results(){
        return {
            ...this.supermore,
            codor_normes:{
                ...this.supermore.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Super More '+this.Parfum()
            }
        }
    }
}
class desoInfiniResults extends cosmetiquesResults{
    supermore;
    constructor(superMore){
        super();
        this.supermore=superMore;
    }
    Color(){return this.supermore.codor_normes.color.infini;}
    Parfum(){return this.supermore.codor_normes.parfum.infini;}
    Results(){
        return {
            ...this.supermore,
            codor_normes:{
                ...this.supermore.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Super More '+this.Parfum()
            }
        }
    }
}
class desoColombienResults extends cosmetiquesResults{
    supermore;
    constructor(superMore){
        super();
        this.supermore=superMore;
    }
    Color(){return this.supermore.codor_normes.color.colombien;}
    Parfum(){return this.supermore.codor_normes.parfum.colombien; }
    Results(){
        return {
            ...this.supermore,
            codor_normes:{
                ...this.supermore.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Super More '+this.Parfum()
            }
        }
    }
}
class desoTropicalResults extends cosmetiquesResults{
    supermore;
    constructor(superMore){
        super();
        this.supermore=superMore;
    }
    Color(){return this.supermore.codor_normes.color.tropical;}
    Parfum(){return this.supermore.codor_normes.parfum.tropical; }
    Results(){
        return {
            ...this.supermore,
            codor_normes:{
                ...this.supermore.codor_normes,
                color:this.Color(),
                parfum:this.Parfum(),
                nom:'Super More '+this.Parfum(),
            }
        }
    }
}
export const superMoreResults={
    presioso:desoPresiosoResults,
    infini:desoInfiniResults,
    colombien:desoColombienResults,
    tropical:desoTropicalResults
}
