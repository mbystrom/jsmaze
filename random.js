export default {
  shuffle,
  randint,
  choice,
  sample
}

function shuffle (array)
{
  for (var i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function randint (start=0, end)
{
  let range = end - start;
  let num = Math.floor(Math.random() * (range)) + start;
  return num;
}

function choice (array)
{
  let index = randint(0, array.length - 1);
  return array[index];
}

function sample (array, count)
{
  let sample = [];
  for (var i = 0; i < count; i++) {
    let index = randint(array.length - 1);
    sample.push(array[index]);
    array.splice(index, 1);
  }
  return sample;
}
