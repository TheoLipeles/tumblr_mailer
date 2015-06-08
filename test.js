var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'HVTTfY2BZe3wKULcwGqAs8o4foLihYiGrewWhOF32Q81i66I2Q',
  consumer_secret: 'LQAPmknyimqIa4k79LMKWQkvOkeUdLcxlFo6MtApzzYah1DlRd',
  token: 'Rh0wGtJYEVXVNEaGfpZUzGJTzZ8VLa91apnhjZNd1iXuuvsD6k',
  token_secret: 'ANe4xXLSzhsIgQno7VHiPOJfQEylKmuPzbz4vEQRGXfSv8vXGG'
});

client.posts("theolipeles.tumblr.com", function(err, blog){
  console.log(blog);
})