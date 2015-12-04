var FACE_MAX = 2,
    EYE_MAX = 6,
    EYEBROW_MAX = 1,
    NOSE_MAX = 12,
    MOUTH_MAX = 6;

var gen_number = 0,
    gen_size = 12,
    mutation_rate = .05,
    genome_length = 5;

var organism = [];
var nextGen = [];

/* create a random genotype for initialization
*/
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

/* run an SGA generation
*/
function ga_runGeneration(ratings){
  var roulette,
      mating,
      genomes;

  console.log("Evaluating faces...")

  roulette = ga_evaluation(ratings);
  console.log("Weightings: [" + roulette + "]");

  // console.log("Playing matchmaker...")
  for(var i = 0; i < gen_size; i+=2){
    mating = ga_selection(roulette);
    //console.log("Orgs " + mating[0] + " and " + mating[1] + " have elected to get it on!");
    console.log("Mating <" + mating[0] + ", " + mating[1] + ">");
    //console.log("Lovemaking in progress...")
    genomes = ga_crossover(mating);

    //console.log("Producing next gen elements " + i + " and " + (i+1)  + ".");
    genomes[0] = ga_mutation(genomes[0]);
    genomes[1] = ga_mutation(genomes[1]);

    nextGen[i] = genomes[0];
    nextGen[i+1] = genomes[1];
  }

  organism = nextGen;
  nextGen = [];

  gen_number++;
  console.log("Generation " + gen_number + " complete!");
}

/* initialize gen_size number of organisms with random genotypes
*/
function ga_initialization(){
  for(var i = 0; i < gen_size; i++){
    organism[i] = randomGenotype();
  }
}

/* takes in ratings and determines the "weighted roulette wheel"
   returns the array of selection points
*/
function ga_evaluation(ratings){

  var total = 0,
      weightings = [],
      roulette = [];

  // get total
  for(var i = 0; i < ratings.length; i++){
    total += Number(ratings[i]);
  }

  roulette[0] = 0;

  // calculate scaled values
  for(var i = 0; i < ratings.length; i++){
    weightings[i] = ratings[i] / total;

    roulette[i] = weightings[i] + (roulette[i-1] || 0);
  }

  return roulette;
}

/* given the roulette wheel, select 2 mates based on a random number generator
    return an object with fields m1, m2 with the indeces of the two mating organisms
*/
function ga_selection(roulette){
  var rand1, rand2,
      mate1, mate2,
      mating;

  rand1 = Math.random();
  rand2 = Math.random();

  mate1 = mate2 = null;

  // find organism number for mating
  for(var j = 0; j < roulette.length; j++){
    if(mate1 == null && rand1 < roulette[j]){
      mate1 = j;
    }
    if(mate2 == null && rand2 < roulette[j]){
      mate2 = j;
    }
  }

  mating = [mate1, mate2];
  return mating;
}

/* create a genome crossover after an index specified in range (0, length -1)
  returns an array of 2 new genomes
*/
function ga_crossover(mating){
    var crossover,
        gene1,
        gene2,
        temp,
        newOrgs;

    gene1 = organism[mating[0]];
    gene2 = organism[mating[1]];

    crossover = randInt(0, genome_length-2);
    temp = gene1;

    gene1.face_id = paramNameNum("face_id") > crossover ? gene2.face_id : gene1.face_id;
    gene1.eye_id = paramNameNum("eye_id") > crossover ? gene2.eye_id : gene1.eye_id;
    gene1.eyebrow_id = paramNameNum("eyebrow_id") > crossover ? gene2.eyebrow_id : gene1.eyebrow_id;
    gene1.nose_id = paramNameNum("nose_id") > crossover ? gene2.nose_id : gene1.nose_id;
    gene1.mouth_id = paramNameNum("mouth_id") > crossover ? gene2.mouth_id : gene1.mouth_id;

    gene2.face_id = paramNameNum("face_id") > crossover ? temp.face_id : gene2.face_id;
    gene2.eye_id = paramNameNum("eye_id") > crossover ? temp.eye_id : gene2.eye_id;
    gene2.eyebrow_id = paramNameNum("eyebrow_id") > crossover ? temp.eyebrow_id : gene2.eyebrow_id;
    gene2.nose_id = paramNameNum("nose_id") > crossover ? temp.nose_id : gene2.nose_id;
    gene2.mouth_id = paramNameNum("mouth_id") > crossover ? temp.mouth_id : gene2.mouth_id;

    newOrgs = [gene1, gene2];

    return newOrgs;
}

/* takes a genome, will randomly change features with a probability of mutation_rate
    returns the mutated genome
*/
function ga_mutation(genome){
  var rand;

  for(var i = 0; i < genome_length; i++){
    rand = Math.random();

    if(rand < mutation_rate){
      console.log("WE HAVE A MUTANT!");
      genome[paramNameNum(i)] = randInt(1, paramLenNameNum(i));
    }
  }

  return genome;
}

/* taking a serch term, either the name of the field or an index
  return the index (if string input) or field name (if index input)
*/
function paramNameNum(search){
  if(!isNaN(search)){
    switch(search){
      case 0:
        return "face_id";
      case 1:
        return "eye_id";
      case 2:
        return "eyebrow_id";
      case 3:
        return "nose_id";
      case 4:
        return "mouth_id";
      default:
        return null;
    }
  }
  else {
    switch(search){
      case "face_id":
        return 0;
      case "eye_id":
        return 1;
      case "eyebrow_id":
        return 2;
      case "nose_id":
        return 3;
      case "mouth_id":
        return 4;
      default:
        return null;
    }
  }
}

/* return the number of different features of each type from a search term
    (see paramNameNum)
    returns the MAX feature number
*/
function paramLenNameNum(search){
  if(!isNaN(search)){
    switch(search){
      case 0:
        return FACE_MAX;
      case 1:
        return EYE_MAX;
      case 2:
        return EYEBROW_MAX;
      case 3:
        return NOSE_MAX;
      case 4:
        return MOUTH_MAX;
      default:
        return null;
    }
  }
  else {
    switch(search){
      case "face_id":
        return FACE_MAX;
      case "eye_id":
        return EYE_MAX;
      case "eyebrow_id":
        return EYEBROW_MAX;
      case "nose_id":
        return NOSE_MAX;
      case "mouth_id":
        return MOUTH_MAX;
      default:
        return null;
    }
  }
}
