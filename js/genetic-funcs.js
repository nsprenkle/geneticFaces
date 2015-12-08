var FACE_MAX = 9,
    EYE_MAX = 12,
    EYEBROW_MAX = 12,
    NOSE_MAX = 12,
    MOUTH_MAX = 6;

var FACE_I = 0,
    EYE_I = 1,
    EYEBROW_I = 2,
    NOSE_I = 3,
    MOUTH_I = 4,
    genome_length = 5;

var gen_number = 0,
    gen_size = 12,
    gen_elites = 2,
    mutation_rate = 0.05;

var organism = [];
var nextGen = [];

// converts a genome array to parameters for drawing
function genotypeFromArray(arr){
  if(arr.length != 5){
    console.error("Bad array input in genotypeFromArray()");
    return;
  }

  var params = {
    face_id : arr[0],
    eye_id : arr[1],
    eyebrow_id : arr[2],
    nose_id : arr[3],
    mouth_id :  arr[4]
  };

  return params;
}

/* create a random genotype for initialization
*/
function randomGenotype(){

  var genome = [];

  genome[FACE_I] = randInt(1, FACE_MAX);
  genome[EYE_I] = randInt(1, EYE_MAX);
  genome[EYEBROW_I] = randInt(1, EYEBROW_MAX);
  genome[NOSE_I] = randInt(1, NOSE_MAX);
  genome[MOUTH_I] = randInt(1, MOUTH_MAX);

  return genome;
}

function ga_getBestOfGeneration(ratings){
    var max = 0,
        copy = ratings.slice(),   // copy the array
        indeces = [];

    for(var i = 0; i < gen_elites; i++){
      max = Math.max.apply(null, copy);
      indeces[i] = copy.indexOf(String(max));
      copy[indeces[i]] = null;
    }

    return indeces;
}

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

/* run an SGA generation
*/
function ga_runGeneration(ratings){
  var roulette,
      mating,
      elite,
      genomes;

  console.log("========== COMPILING GENERATION " + (gen_number+1) + " ==========");
  roulette = ga_evaluation(ratings);
  console.log("Weightings: [" + roulette + "]");

  // find the best of generation and copy to the next gen
  elite = ga_getBestOfGeneration(ratings);
  for(var i = 0; i < elite.length; i++){
    console.log("Copying org " + elite[i] + " by elitism");
    nextGen.push(organism[elite[i]]);
  }

  // console.log("Playing matchmaker...")
  for(var i = 0; i < gen_size - elite.length; i+=2){
    mating = ga_selection(roulette);

    console.log("Mating " + mating[0] + " & " + mating[1]);
    genomes = ga_crossover(mating);

    genomes[0] = ga_mutation(genomes[0]);
    genomes[1] = ga_mutation(genomes[1]);

    nextGen.push(genomes[0]);
    nextGen.push(genomes[1]);
  }

  organism = nextGen;
  nextGen = [];
  gen_number++;
}

/* initialize gen_size number of organisms with random genotypes
*/
function ga_initialization(){
  gen_number = 0;

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

    // round to 3 decimals
    roulette[i] = Math.round(roulette[i] * 1000)/1000;
  }

  roulette[ratings.length-1] = 1.00;
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
        gene1, gene2, temp,
        newOrgs;

    // get the genes from the population
    gene1 = organism[mating[0]].slice();    // copy the genome
    gene2 = organism[mating[1]].slice();    // copy the genome

    // crossover occurs AFTER this index
    // so that each child retains at least 1 feature from each parent
    crossover = randInt(0, genome_length-2);
    temp = gene1;

    // perform crossover
    for(var i = 0; i < genome_length; i++){
      gene1[i] = i > crossover ? gene1[i] : gene2[i];
      gene2[i] = i > crossover ? gene2[i] : temp[i];
    }

    newOrgs = [gene1, gene2];

    return newOrgs;
}

/* takes a genome, will randomly change features with a probability of mutation_rate
    returns the mutated genome
*/
function ga_mutation(genome){
  var rand, newGenome = genome;

  // give each feature the ability to be mutated
  for(var i = 0; i < genome_length; i++){
    rand = Math.random();

    // if the RNG produces a number below the mutation rate, randomly swap the element
    if(rand < mutation_rate){
      console.log("\t^mutation(" + i + ")");
      newGenome[i] = randInt(1, featureMaxIndex(i));
    }
  }

  return newGenome;
}

/* given search index of feature in genome, return number of unique features
*/
function featureMaxIndex(search){
    switch(search){
      case FACE_I:
        return FACE_MAX;
      case EYE_I:
        return EYE_MAX;
      case EYEBROW_I:
        return EYEBROW_MAX;
      case NOSE_I:
        return NOSE_MAX;
      case MOUTH_I:
        return MOUTH_MAX;
      default:
        return null;
    }
}
