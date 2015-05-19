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
/api/users/create_user post {username: 'example', password: 'pass'}

Sign In:
/api/users/sign_in -u example:pass

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
| _id        |  id    | Mongo DB internal id|
| artist     |  string  |  Name of Artist |
| name       |  string  |  Name of the song     |
| duration   |  number  |  The track length in miliseconds|
| album   |  string  |   Name of the Album|
| coverArt  |  string  |  URL to coverArt |
| genre   |  string  | stored in spotify on the album object |
