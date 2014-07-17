var Lrc = require('lrc').Lrc;
var request = require('request');

var errors = {};
errors.nf = 'title and artist required';
errors.lrcNf = 'lrc not found';

exports.print = function(lrc, callback) {
  var line = new Lrc(lrc.toString(), callback);
  line.play(0);
  return line;
}

exports.fetch = function(song, callback) {
  if (!song) return callback(new Error(errors.nf));
  var title = song.title;
  var artist = song.artist;
  if (!title || !artist) return callback(new Error(errors.nf));
  request.get({url:'http://geci.me/api/lyric/' + title + '/' + artist, json:true}, function(err, res, songs) {
    if (err) return callback(err);
    var code = res.statusCode;
    if (code !== 200) return callback(new Error(code));

    if (songs.count <= 0) return callback(songs.err);
    if (!songs.result) return callback(new Error(errors.lrcNf));
    if (!songs.result[0]) return callback(new Error(errors.lrcNf));
    if (!songs.result[0].lrc) return callback(new Error(errors.lrcNf));

    return request.get(songs.result[0].lrc, function(err, res, result) {
      if (err) return callback(err);
      var code = res.statusCode;
      if (code !== 200) return callback(new Error(code));
      return callback(null, result);
    });
  });
}

