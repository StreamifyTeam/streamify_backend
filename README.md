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
| dateCreated   |  Date  |   |
| createdBy  |  string  |  User's name (not user id) |

#####Example

songs can be accessed with
```

playlist =  db.playlists.findOne({_id: playlist's ID});
favorites = db.songs.find({_id: { $in : playlist.songs } } ).toArray();

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
| genre   |  string  | stored in spotify on the album object |

```

API
Get all songs:
	GET: /api/songs get

Find a song by spotifyID
	GET: /api/songs/SPOTIFYID get

Add a new song:
	POST: /api/songs post {artist: 'CodeFellows', name: 'JavaScript', album: 'Summer', duration: '3:00', spotifyID: 'test spotify id', genre: 'rock'}

```