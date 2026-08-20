class ProductStrategyContext{
    constructor(
        // data,
        strategy){
        this.setAnalysee(strategy);
        // this.data(data);

    }

    setAnalysee(strategy){
        this.Analysee=strategy;
    }
    // setData(data){
    //     this.data=data;
    // }

    Results(resultats,isConforme){
        return this.Analysee.Results(resultats,isConforme);
    }
    
}

export default ProductStrategyContext;