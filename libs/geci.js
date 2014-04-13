var request = require('request');

module.exports = Geci;

function Geci(title, artist, callback) {
  if (!title || !artist) return callback(new Error('title and artist required'));
  request.get('http://geci.me/api/lyric/' + title + '/' + artist, function(err, res, songs) {
    if (err) return callback(err);
    var code = res.statusCode;
    if (code !== 200) return callback(new Error(code));

    if (songs.count <= 0) return callback(songs.err);
    if (!songs.result) return callback(new Error('lrc not found'))
    if (!songs.result[0]) return callback(new Error('lrc not found'))
    if (!songs.result[0].lrc) return callback(new Error('lrc not found'))

    return request.get(songs.result[0].lrc, function(err, res, result) {
      if (err) return callback(err);
      var code = res.statusCode;
      if (code !== 200) return callback(new Error(code));
      return callback(null, result);
    });
  
  })
}