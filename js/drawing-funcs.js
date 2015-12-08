function clearCanvas(c, ctx){
  // canvas vars
  var x_max = c.width,    // x max of canvas
      y_max = c.height,   // y max of canvas
      x_mid = x_max/2,    // x halfway point of canvas
      y_mid = y_max/2;    // y halfway point of canvas

  ctx.fillStyle = "#FFFFFF";
  ctx.rect(0, 0, c.width, c.height);
  ctx.fill();
  ctx.clearRect(0, 0, c.width, c.height);
}

function randInt(low, high){
    var random = Math.random();
    var range = (high-low)+1;
    random = Math.floor((random * range)) + low;
    return random;
}

function transformReset(c, ctx){
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function transformMirror(c, ctx){
  // canvas vars
  var x_max = c.width;    // x max of canvas

  // mirror image
  ctx.translate(c.width, 0);
  ctx.scale(-1,1);
}

function zeroPadTwo(input){
  if(Number(input) < 10){
    return "0" + input;
  }
  return "" + input;
}

function drawFace(c, ctx, params, drawGrid){

  // canvas vars
  var x_max = c.width,    // x max of canvas
      y_max = c.height,   // y max of canvas
      x_mid = x_max/2,    // x halfway point of canvas
      y_mid = y_max/2;    // y halfway point of canvas

  var face = new Image(),
      eyebrow = new Image(),
      eye = new Image(),
      nose = new Image(),
      mouth = new Image();

  // source images
  face.src = "img/faces/" + zeroPadTwo(params.face_id) + ".svg";
  eyebrow.src = "img/eyebrows/" + zeroPadTwo(params.eyebrow_id) + ".svg";
  eye.src = "img/eyes/" + zeroPadTwo(params.eye_id) + ".svg";
  nose.src = "img/noses/" + zeroPadTwo(params.nose_id) + ".svg";
  mouth.src = "img/mouths/" + zeroPadTwo(params.mouth_id) + ".svg";

  var head_top = y_max *1/7;
  var head_side = x_max * 2/13;

  if(drawGrid){
    ctx.strokeStyle = "#BBBBBB";

    // RATIO LINES
    // horizontal
    for(var i = 0; i < 8; i++){
      ctx.moveTo(0, head_top + ((y_max - head_top * 2) * i/7));
      ctx.lineTo(x_max, head_top + ((y_max - head_top * 2) * i/7));
    }
    // vertical
    for(var i = 0; i < 6; i++){
      ctx.moveTo(head_side + ((x_max - head_side * 2) * i/5), 0);
      ctx.lineTo(head_side + ((x_max - head_side * 2) * i/5), y_max);
    }
    // center
    ctx.moveTo(x_mid, 0);
    ctx.lineTo(x_mid, y_max);
    ctx.moveTo(0, y_mid);
    ctx.lineTo(x_max, y_mid);
    ctx.stroke();
  }

  var canvSize = Math.min(c.width, c.height);

  // FACE
  // source images are 1000x1000
  var face_width = canvSize * 6/8 , //params.face_width,
      face_height = face_width, //face_width * (1 + face_wh_ratio/100); //params.face_height;
      face_y_offset = canvSize * 1/30;

  var eyeline = face_height * 4/10;   // 4/10 from top

  // EYES
  // source images are 150x100
  var eye_width = face_width * 1/7,
      eye_height = 2/3 * eye_width,
      //eye_tilt = 0,
      eye_x_offset = x_max * 1/7,
      eye_y_offset = 0;//(face_height * 1/2 - eyeline);//0;

  // EYEBROWS
  // source images are 120 x 80 - anchored at bottom corner
  var brow_width = x_max * 1/6,
      brow_height = x_max * 1/6,
      //brow_tilt = 0,
      brow_x_offset = eye_x_offset,
      brow_y_offset = eye_y_offset + y_max * 1/9;

  // NOSE
  // source images are 100x150
  var nose_width = x_max * 1/7,
      nose_height = y_max * 3/14,
      nose_y_offset = -y_max * 1/14;

  // MOUTH
  var mouth_width = x_max * 1/8,
      mouth_height = y_max * 1/8,
      mouth_y_offset = y_max * 1/4;

  face.onload = function() {
    // tranlate to canvas center
    transformReset(c, ctx);
    ctx.translate(x_mid, y_mid);

    // draw face
    ctx.drawImage(face,
      -face_width/2,
      -face_height/2 + face_y_offset,
      face_width,
      face_height
    );

    // reset tranlation
    transformReset(c, ctx);
  }

  eye.onload = function() {
    // translate to canvas center
    transformReset(c, ctx);
    ctx.translate(x_mid, y_mid);
    //ctx.rotate(eye_tilt);

    // draw right eye
    ctx.drawImage(eye,
      eye_x_offset - eye_width/2,
      -eye_y_offset - eye_height/2,
      eye_width,
      eye_height
    );

    // mirror across center
    transformReset(c, ctx);
    transformMirror(c, ctx);
    ctx.translate(x_mid, y_mid);
    //ctx.rotate(eye_tilt);

    // draw left eye
    ctx.drawImage(eye,
      eye_x_offset - eye_width/2,
      -eye_y_offset - eye_height/2,
      eye_width,
      eye_height
    );

    // reset translation
    transformReset(c, ctx);
  }

  eyebrow.onload = function() {
    // translate to canvas center
    transformReset(c, ctx);
    ctx.translate(x_mid, y_mid);
    //ctx.rotate(brow_tilt);

    // draw right brow
    ctx.drawImage(eyebrow,
      brow_x_offset - brow_width/2,
      -brow_y_offset - brow_height/2,
      brow_width,
      brow_height
    );

    // mirror across center
    transformReset(c, ctx);
    transformMirror(c, ctx);
    ctx.translate(x_mid, y_mid);
    //ctx.rotate(brow_tilt);

    // draw left brow
    ctx.drawImage(eyebrow,
      brow_x_offset - brow_width/2,
      -brow_y_offset - brow_height/2,
      brow_width,
      brow_height
    );

    // reset translation
    transformReset(c, ctx);
  }

  nose.onload = function() {
    // translate to canvas center
    transformReset(c, ctx);
    ctx.translate(x_mid, y_mid);

    ctx.drawImage(nose,
      -nose_width/2,
      nose_y_offset,
      nose_width,
      nose_height
    );
  }

  mouth.onload = function() {
    transformReset(c, ctx);
    ctx.translate(x_mid, y_mid);

    ctx.drawImage(mouth,
      -mouth_width/2,
      mouth_y_offset - mouth_height/2,
      mouth_width,
      mouth_height
    );

    transformReset(c, ctx);
  }

}
