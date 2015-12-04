var REV = "3.00";
var canvases;

$(document).ready(function(){

  // get the canvas elements
  canvases = $('canvas');

  $('button').click(function(){
    //alert("CLICKED!");
    var ratings = getRatings();
    ga_runGeneration(ratings);
    populateCanvases();
  });

  $('canvas').dblclick(function(){
      var id = this.id;
      id = id.slice(1, id.length);

      var params = organism[id];
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

  // start gen-0 and populate canvases
  ga_initialization();
  populateCanvases();

});

function populateCanvases(){
  for(var i = 0; i < canvases.length; i++)
  {
    c = canvases[i];
    // Initaliase a 2-dimensional drawing context
    var ctx = c.getContext('2d');

    transformReset(c, ctx);
    clearCanvas(c, ctx);

    //Canvas commands go here
    ctx.fillStyle = "#000000";
    ctx.font = "20px Helvetica";
    ctx.fillText("org(" + gen_number + ", " + i + ")" , 10, 20);

    // get params from organism genotype
    var params = organism[i];

    // draw face
    drawFace(c, ctx, params);
  }
}

function getRatings(){
  var ratings = [];

  $(".panel").each(function(index) {
    var rating = $(this).find("form input:checked").val() || "0";
    ratings[index] = rating;
  });

  return ratings;
}
