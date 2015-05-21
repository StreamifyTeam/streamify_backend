# Streamify Backend
[![Build Status](https://travis-ci.org/StreamifyTeam/streamify_backend.svg?branch=master)](https://travis-ci.org/StreamifyTeam/streamify_backend)

##Mongo DB Schema & Methods

####Users  /api/users/...


| Field Name | Value Type | Description          |
| -------------| ----------- | ----------- |
| _id          |  id      | Mongo DB internal id|
| username     |  string  |  unique    |
| email        |  string  |  not unique|
| password     |  string  |     |
| userType     |  string  |  _Restricted_ to [spotify, local]|
| favorites    |  Array of Songs  |  Stored as: [_id, _id...] |
| history      |  string  |    |
| uniqueHash   |  string  | Used to create the EAT; easier to invalidate users |

#####Examples

Favorites can be accessed with
```

user =  db.users.findOne({username: example});
favorites = db.songs.find({_id: { $in : user.favorites } } ).toArray();

```


```
Create:
/api/user/create_user post {username: 'egitxample', password: 'pass'}

Sign In:
/api/user/sign_in -u example:pass

Sign In with spotify user:
/api/user/spotify_user  

Favorites:

  GET:
  /api/user/fav get {eat: 'tokenValueHere'}

  PUT:
  /api/user/fav put {eat: 'tokenValueHere', favorites: 'addYourFavoriteHere'}

  DELETE:
  /api/user/fav delete {eat: 'tokenValueHere', favorites: 'favoriteToBeDeleted'}

```

####Playlists /api/playlist/...
| Field Name | Value Type | Description          |
| -----------| ----------- | ----------------|
| _id        |  id    | Mongo DB internal id|
| name       |  string  |  Name of the Playlist; not unique |
| songs      |  Array of Songs |  Songs in the playlist; Stored as: [_id, _id...]  |
| collaborators   |  Array of Users  |  Stored as: [_id, _id...] |
| dateCreated   |  String  |   |
| createdBy  |  string  |  User's name (not user id) |

#####Example

playlists can be accessed with
```

playlist =  db.playlists.findOne({_id: playlist's ID});
favorites = db.songs.find({_id: { $in : playlist.songs } } ).toArray();

```

```
API: (currently getting updated to authenticate users)

  POST:
    Search for playlists:
      /api/playlist/search post {searchString: "search string", eat: token}
        Responds with an array of all playlist objects.
    Get a user's playlists:
      /api/playlist/mine post {eat: token}
        Responds with an array of all owned playlist objects.

  POST:
    Create playlist:
      /api/create_playlist/ post {name: "playlistname",  eat: token}
        Responds with the created playlist object.
    Add song to playlist:
      /api/playlist/ post {id: playlistID, eat: token, artistName: artistname,
                          trackName: trackname, duration: duration,
                          albumName: albumname, uri: spotifyURI,
                          albumArtworkURL: albumArtworkURL}
        Responds with the object {msg: 'success'}

  DELETE:
    Delete playlist:
      /api/delete_playlist/ del {id: playlistID, eat: token}
        Responds with the object {msg: 'success'}
    Delete song from playlist:
      /api/playlist/ del {name: "playlistname", song: streamifySongID, eat: token}
        Responds with the updated playlist.

```

####Songs /api/songs/...

| Field Name | Value Type | Description       |
| -----------| ----------- | ----------------|
| artist     |  string  |  Name of Artist, required|
| name       |  string  |  Name of the song, unique|
| duration   |  number  |  The track length in miliseconds|
| album   |  string  |   Name of the Album|
| coverArt  |  string  |  URL to coverArt |
| spotifyID  |  string  |  URL to Spotify, unique|
| album_artwork_url  |  string  |  URL to album artwork, unique|

```

API
Get all songs:
	GET: /api/songs get

Find a song by spotifyID
	GET: /api/songs/SPOTIFYID get
  return: a Song object
Add a new song:
	POST: /api/songs post {artist: 'CodeFellows', name: 'JavaScript', album: 'Summer', duration: '3:00', spotifyID: 'test spotify id'}

Get a list of songs by a list of SPOTIFYID. I'm using a POST request instead of GET because GET request does not allow to pass in a json
  POST: /api/songs/arrayID post '["spotifyID1", "spotifyID2"]'
  return song objects:
   { msg: 
   [ { _id: '555e57db9d62474b58eeef0b',
       artist: 'CodeFellows1',
       name: 'JavaScript1',
       album: 'Summer',
       duration: '300',
       spotifyID: 'id1',
       __v: 0 },
     { _id: '555e58239d62474b58eeef0f',
       artist: 'CodeFellows1',
       name: 'JavaScript2',
       album: 'Summer',
       duration: '300',
       spotifyID: 'id2',
       album_artwork_url: '2',
       __v: 0 } ] }

```

####Discovery  
##### Endpoints

| Endpoint                   | Request | Response    |
| ---------------------------| ------- | ------------|
|/api/discovery/artist/:name | GET     | See Below (1)  |
|/api/discovery/genre/:name  | GET     | See Below (1) |
|/api/discovery/related/:id  | GET     | See Below (1)  |
|/api/discovery/top-tracks/:id | GET     | See Below (2)  |
|/api/discovery/youtube/:query | GET     | See Below (3)  |



###### Response format
######(1)
{artists: [
  {id: id,
  name: name,
  popularity: popularity,
  url: url
  }, ...
  ]}
######(2)
{tracks: [
  {id: id,
  name: name,
  popularity: popularity,
  }, ...
  ]}
######(3)
{videos: [
  {id: id,
  title: title,
  thumb: thumb,
  }, ...
  ]}
