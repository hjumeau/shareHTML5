
var piece = document.querySelector('#pion');

document.addEventListener('DOMContentLoaded', function() {

	var damier = document.querySelector('#damier');
	
	for(var j=0; j<8; j++){
		if(j!==0){
			br = document.createElement('br');
			damier.appendChild(br);
		}
		for(var i=0; i<8; i++){
			
			square = document.createElement('div');
			square.setAttribute("id",j+"&"+i);
			square.ondragover= dragOver;
            square.ondrop= drop;
					 
			if((j%2===0)&&(i%2===0)){
				square.setAttribute("class","even");
			}if((j%2===0)&&(i%2!==0)){
				square.setAttribute("class","odd");
			}
			if((j%2!==0)&&(i%2===0)){
				square.setAttribute("class","odd");
			}if((j%2!==0)&&(i%2!==0)){
				square.setAttribute("class","even");
			}
			
			if(!(j>2&&j<5)){
			
				piece = document.createElement('div');
				piece.setAttribute("id",j+":"+i);
				piece.setAttribute("draggable","true");
				piece.ondragstart = dragStart;
				piece.ondragend = dragEnd;
				
				if(j>3){
					piece.setAttribute("class","pion_black");
				}else{
					piece.setAttribute("class","pion_white");
				}
				square.appendChild(piece);
			}
			
			damier.appendChild(square);
		}
	}         
}, false);

function drop(event) {
	//RegEx "piece_white"
	var exp=/pion/g;
	var idElement = event.target.getAttribute("class");
	if(exp.test(idElement)){
		var square = event.target.parentNode;
		square.removeChild(this.childNodes[0]);
		square.appendChild(document.getElementById(event.dataTransfer.getData('Text')));
	}else{
		event.target.appendChild(document.getElementById(event.dataTransfer.getData('Text')));
	}
	event.stopPropagation(); 
	return false;
}       
function dragOver(event) {
	/*if (event.target.querySelector('img') || event.target.nodeName=="IMG" ){
		return true;
	}*/ 
	if (event.preventDefault) event.preventDefault(); // allows us to drop
	event.dataTransfer.dropEffect = 'move';
	return false;
}
function dragEnd(event) {
	/*event.target.classList.toggle('possible');
	toggleDropZones();*/
}
function dragStart(event) {
	event.dataTransfer.effectAllowed = 'move';
	event.dataTransfer.setData("Text", event.target.getAttribute('id')); 
	/*event.target.classList.toggle('possible');
	toggleDropZones();*/
}
