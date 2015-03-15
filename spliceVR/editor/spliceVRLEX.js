/*
SpliceVR Editor: A video editor for cinematic virtual reality
Copyright (C) 2015 Alex Meagher Grau

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

(function(global) {
	SpliceVRLEX = function() {
		this.lex = "";
	};

	SpliceVRLEX.prototype.openLEX = function() {
		var input = document.createElement("input");
		input.type = "file";
		input.accept = ".lex";
		var t = this;
		input.addEventListener("change", function (event) {
			var files = input.files;
			if (!files.length)
				return;
			t.lex = URL.createObjectURL(files[0]);
			t.importLEX();
		});
		input.click();
	};


	SpliceVRLEX.prototype.importLEX = function() {
		renderNodes.length = 0;
		renderLinks.length = 0;
		var xhttp = new XMLHttpRequest('UTF-8');
		xhttp.open('GET', this.lex, false);
		try{
			xhttp.send();
			var lexFile = xhttp.responseXML;
			var lexNodes = lexFile.getElementsByTagName('node');
			for(var n = 0; n < lexNodes.length; n++){
				renderNodes.push(new SpliceVRNode());
				var nodeX = lexNodes[n].getElementsByTagName('x');
				renderNodes[n].x = parseFloat(nodeX[0].childNodes[0].nodeValue);
				var nodeY = lexNodes[n].getElementsByTagName('y');
				renderNodes[n].y = parseFloat(nodeY[0].childNodes[0].nodeValue);
			}
		}
		catch(e){
			
		}

	};

	SpliceVRLEX.prototype.saveLEX = function() {
		var lexStr = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        lexStr += "\n\t<lex>";
		for (var n = 0; n < renderNodes.length; n++){
			lexStr += "\n\t\t<node>";
			lexStr += "\n\t\t\t<id>"+(65536+n)+"</id>";
			lexStr += "\n\t\t\t<x>"+(renderNodes[n].x)+"</x>";
			lexStr += "\n\t\t\t<y>"+(renderNodes[n].y)+"</y>";
			lexStr += "\n\t\t\t<media>";
			lexStr += "\n\t\t\t</media>";
			lexStr += "\n\t\t\t<events>";
			lexStr += "\n\t\t\t</events>";
			lexStr += "\n\t\t\t<timeline>";
			lexStr += "\n\t\t\t</timeline>";
			lexStr += "\n\t\t</node>";
		}
		lexStr += "\n\t\t<global>";
		lexStr += "\n\t\t</global>";
        lexStr += "\n\t</lex>";

        var blob = new Blob([lexStr], {type : 'text/xml'});
        var downloadLink = document.createElement("a");
		downloadLink.download = "export.lex";
		if (window.webkitURL != null)
			downloadLink.href = window.webkitURL.createObjectURL(blob);
		else{
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	};
})(window);