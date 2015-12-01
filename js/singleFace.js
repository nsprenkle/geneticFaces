var REV = "3.00";

$(document).ready(function(){
  // get the canvas
  var c = $('#myDrawing')[0];

  // Check the element is in the DOM and the browser supports canvas
  if(!c.getContext){
    error("Canvas not found... abort! abort!");
    return;
  }

  // Initaliase a 2-dimensional drawing context
  var ctx = c.getContext('2d');

  //Canvas commands go here
  ctx.font = "20px Helvetica";
  ctx.fillText("[Face Test - " + REV + "]", 10, 20);

  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#DDDDDD";

  var face_id = $("#face_id").val(),

      eye_id = $("#eye_id").val(),

      eyebrow_id = $("#eyebrow_id").val(),
      nose_id = $("#nose_id").val(),
      mouth_id = $("#mouth_id").val();

  var params = {
    face_id : face_id,
    eye_id : eye_id,
    eyebrow_id : eyebrow_id,
    nose_id : nose_id,
    mouth_id : mouth_id
  };

  $("input").change(function(){
    params[this.id] = Number(this.value);
    clearCanvas(c, ctx);
    drawFace(c, ctx, params);
  });

  // draw face
  drawFace(c, ctx, params);
});
