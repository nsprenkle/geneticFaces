var FACE_MAX = 2,
    EYE_MAX = 6,
    EYEBROW_MAX = 1,
    NOSE_MAX = 12,
    MOUTH_MAX = 6;

function randomGenotype(){
  var params = {
    face_id : randInt(1, FACE_MAX),
    eye_id :  randInt(1, EYE_MAX),
    eyebrow_id :  randInt(1, EYEBROW_MAX),
    nose_id :  randInt(1, NOSE_MAX),
    mouth_id :  randInt(1, MOUTH_MAX)
  };
  return params;
}
