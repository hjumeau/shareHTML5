var l = 50000000;

//on remplit un tableau
for(var i = 0; i < l; i++){
//tous les 100 tours, on informe le thread principal
  if(i%100 === 0){
    postMessage(i);
  }
}