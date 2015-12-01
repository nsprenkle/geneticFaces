var REV = "3.00";
var genomes = [];

$(document).ready(function(){

  // get the canvas
  var canvases = $('canvas');

  $('canvas').dblclick(function(){
      var id = this.id;
      id = id.slice(1, id.length);

      /*c = this;
      ctx = c.getContext('2d');
      transformReset(c, ctx);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#00FF00";
      ctx.rect(0, 0, c.width, c.height);
      ctx.fill();*/

      var params = genomes[id];
      alert("Selected face " + id + "\n" +
        "Face type = " + params.face_id + "\n" +
        "Eye type = " + params.eye_id + "\n" +
        "Brow type = " + params.eyebrow_id + "\n" +
        "Nose type = " + params.nose_id + "\n" +
        "Mouth type = " + params.mouth_id + "\n"
      );
  })

  // Check the element is in the DOM and the browser supports canvas
  for(var i = 0; i< canvases.length; i++)
  {
    if(!canvases[i].getContext){
      error("Canvas not found... abort! abort!");
      return;
    }
  }

  for(var i = 0; i < canvases.length; i++)
  {
    c = canvases[i];
    // Initaliase a 2-dimensional drawing context
    var ctx = c.getContext('2d');

    //Canvas commands go here
    ctx.font = "20px Helvetica";
    ctx.fillText("Face " + i , 10, 20);

    // generate the initial genotype
    var params = randomGenotype();
    genomes[i] = params;

    // draw face
    drawFace(c, ctx, params);
  }
});
