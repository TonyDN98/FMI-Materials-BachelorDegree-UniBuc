/* Buton Play/Pause */
var mediaClip = document.getElementById("playme");

function playPause() 
{
	var mediaClip = document.getElementById("playme");
	if (mediaClip.paused) 
	{mediaClip.play();} 
	else 
	{mediaClip.pause();}
}

function change() 
{
	var buttonPlay = document.getElementById("buttonPlay");
	if (buttonPlay.value==="Play") buttonPlay.value = "Pause";
	else buttonPlay.value = "Play";
}




/* Pentru a seta Atribute Elemente */
function setAttributes(el, attrs) 
{
	for(var key in attrs) 
	{
		el.setAttribute(key, attrs[key]);
	}
}

window.onload=function()
{
	
	/* Select Simplu */
	v=["Pick Audio File", "Melodie 1", "Melodie 2", "Melodie 3"];
	var sel=document.createElement("select");
	document.getElementById("song").appendChild(sel);
	for(el of v)
	{
		sel.innerHTML+=`<option value="${el}"> ${el} </option>`;
	}
	sel.onchange=function()
	{
		var y = sel.value;
		var x = y.match(/\d+/)[0] // ia prima cifra din sirul de caractere
	
		if(x==1) 
		{
			var audio = document.getElementById('playme'); 
			playme.src='uploads/Audio/melodie1.mp3'; 
			audio.load();
			audio.play();
		
		}
		else if(x==2)
		{
			var audio = document.getElementById('playme'); 
			playme.src='uploads/Audio/melodie2.mp3'; 
			audio.load();
			audio.play();
		}
		else if(x==3)
		{
			var audio = document.getElementById('playme'); 
			playme.src='uploads/Audio/melodie3.mp3'; 
			audio.load();
			audio.play();
		}
	}
	
	
	
	/* Input Range */
	var ir = document.createElement("input");
	setAttributes(ir, {"type": "range", "min": "0", "max": "1.0", "step": "0.2", "value": "1"});
	document.getElementById("song").appendChild(ir);
	ir.onchange=function()
	{
		var mediaClip = document.getElementById("playme");
		mediaClip.volume = this.value;
	}
	
	
	
	/* CheckBox - Dark Mode */
	var ch=document.createElement("input");
	setAttributes(ch, {"type": "checkbox", "id": "myCheck"});
	document.getElementById("cutiuta").appendChild(ch);
	
	//ch.checked=false; //la inceput suntem pe tema normala
	ch.onclick=function()
	{
		var aux = document.getElementById("casuta_magica");
		var myVar;
		
		if(this.checked) 
		{
			
			//Dacă vrem să anulăm setarea pt că am apasat din greseala și stergem si butonul
			var buton=document.createElement("button");
			buton.innerHTML="Anulează";
			buton.id="butonNou";
			document.getElementById("cutiuta").appendChild(buton);
			buton.onclick=function()
			{
				clearTimeout(myVar);
				ch.checked=!ch.checked;
				var elem=document.getElementById("butonNou");
				elem.parentNode.removeChild(elem);
			}
			
			myVar = setTimeout(function()
			{
				alert("Se activează Dark Mode!");
				document.body.style.backgroundColor="black";
				document.body.style.color="#ccc";
				aux.style.display="block";
				var elem=document.getElementById("butonNou");
				elem.parentNode.removeChild(elem);
			}, 3000);
			
		}
		else 
		{
			//Dacă vrem să anulăm setarea pt că am apasat din greseala și stergem si butonul
			var buton=document.createElement("button");
			buton.innerHTML="Anulează";
			buton.id="butonNou";
			document.getElementById("cutiuta").appendChild(buton);
			buton.onclick=function()
			{
				clearTimeout(myVar);
				ch.checked=!ch.checked;
				var elem=document.getElementById("butonNou");
				elem.parentNode.removeChild(elem);
			}
			
			
			myVar = setTimeout(function()
			{
				alert("Se dezactivează Dark Mode!");
				document.body.style.backgroundColor="white";
				document.body.style.color="black";
				aux.style.display="none";
				var elem=document.getElementById("butonNou");
				elem.parentNode.removeChild(elem);
			}, 3000);
		}
	}
	
	
	
	/* Animate - SetInterval */
	var ceva=document.getElementById("ceva");  
	ceva.onclick=function() 
	{
		var elem = document.getElementById("poza");  
		var pos = -200;
		var id = setInterval(frame, 5);
		function frame() 
		{
			if (pos == 1300) 
			{
				clearInterval(id);
			} 
			else 
			{
				pos++; 
				elem.style.marginLeft = pos + "px"; 
			}
		}
	}
	
	
	/* SetInterval */
	setInterval(function() 
	{
		var d = new Date();
		var t = d.toLocaleTimeString();
		document.getElementById("demo").innerHTML = t;
	}, 1000);
	
	
	
	
	/* Input Radio */
	var radio = document.createElement("input");
	setAttributes(radio, {"type": "radio", "value": "Vrăjitor"});
	document.getElementById("radio").appendChild(radio);
	radio.onclick=function()
	{
		if(radio.checked)
		{
			this.disabled=true;
			document.body.style.cursor="auto";
		}
	}
		
	
	
	
	/* Modal */
	var modal = document.getElementById("myModal");

	// Iau poza si o inserez in modal - "alt"=caption
	var img = document.getElementById("myImg");
	var modalImg = document.getElementById("img01");
	var captionText = document.getElementById("caption");
	img.ondblclick = function()
	{
		modal.style.display = "block";
		modalImg.src = this.src;
		captionText.innerHTML = this.alt;
	}

	// <span> element pt inchidere
	var span = document.getElementsByClassName("close")[0];

	// Click <span> (x), inchidere
	span.onclick = function() 
	{ 
		modal.style.display = "none";
	}
	
}



/* Galerie */
// Elemente cu class="column"
var elements = document.getElementsByClassName("column");
var i;
// Full-width 
function one() 
{
	for (i = 0; i < elements.length; i++) 
	{
		elements[i].style.msFlex = "100%";  	
		elements[i].style.flex = "100%";
	}
}

function two() 
{
	for (i = 0; i < elements.length; i++) 
	{
		elements[i].style.msFlex = "50%";  
		elements[i].style.flex = "50%";
	}
}
 /* Apas Tasta 4 -> Se pune pe 4 Coloane */
window.onkeypress=function(e)
{
	if(e.key=="4")
		for (i = 0; i < elements.length; i++) 
		{
			elements[i].style.msFlex = "25%";  
			elements[i].style.flex = "25%";
		}
	else if(e.key=="0") two();
}




/* Coordonate Mouse */
function showCoords(event) 
{
	var x = event.clientX;
	var y = event.clientY;
	
	var coor;
	
	if(x<=411)  coor="Ron te salută. :)";
	else if(412<x && x<=625) coor="Avada Kadavra! Voldermort te-a omorât. :(";
	else if(626<x && x<=842) coor="Ajută-l pe Harry să îl înfrunte pe lordul Voldermort! :)";
	else if(x>843) coor="Hermione e de partea ta! :)";
	document.getElementById("domo").innerHTML = coor;
}

function clearCoor() 
{
	document.getElementById("domo").innerHTML = "";
}


