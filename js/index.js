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

    // reset ranges to 50
    $("input[type='range']").val(50);
  });

  $('canvas').dblclick(function(){
      var id = this.id;
      id = id.slice(1, id.length);

      var face = organism[id][FACE_I],
          eye = organism[id][EYE_I],
          eyebrow = organism[id][EYEBROW_I],
          nose = organism[id][NOSE_I],
          mouth = organism[id][MOUTH_I];

      alert("Selected face " + id + "\n" +
        "Face type = " + face + "\n" +
        "Eye type = " + eye + "\n" +
        "Brow type = " + eyebrow + "\n" +
        "Nose type = " + nose + "\n" +
        "Mouth type = " + mouth + "\n"
      );
  })

  // Check the element is in the DOM and the browser supports canvas
  for(var i = 0; i< canvases.length; i++) {
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
    ctx.fillText("FACE " + i + ", GEN " + gen_number, 10, 20);

    // get params from organism genotype
    var params = genotypeFromArray(organism[i]);

    // draw face
    drawFace(c, ctx, params);
  }
}


function getRatings(){
  var ratings = [];

  $(".panel").each(function(index) {
    var rating = $(this).find("form input").val();
    ratings[index] = rating;
  });

  return ratings;
}
