## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd><p>The main Client object</p>
</dd>
<dt><a href="#Collection">Collection</a> ⇐ <code>Map</code></dt>
<dd><p>Hold a bunch of something</p>
</dd>
<dt><a href="#Booth">Booth</a></dt>
<dd><p>Represents a rooms booth settings</p>
</dd>
<dt><a href="#Media">Media</a></dt>
<dd><p>Represents a media object</p>
</dd>
<dt><a href="#Message">Message</a></dt>
<dd><p>Represents a single chat message</p>
</dd>
<dt><a href="#Playback">Playback</a></dt>
<dd><p>Represents a Play</p>
</dd>
<dt><a href="#Room">Room</a></dt>
<dd><p>Represents a room</p>
</dd>
<dt><a href="#User">User</a></dt>
<dd><p>Represents a user.</p>
</dd>
</dl>

<a name="Client"></a>

## Client
The main Client object

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ready | <code>Boolean</code> | Indicates if the client is ready for rest calls. |
| room | <code>String</code> | Slug of the current room. |
| socketStatus | <code>String</code> | The current statsu of the socket connection |


* [Client](#Client)
    * [new Client(email, password, [options])](#new_Client_new)
    * [.connect()](#Client+connect) ⇒ <code>Promise</code>
    * [.joinRoom(slug)](#Client+joinRoom) ⇒ <code>Promise</code>
    * [.sendChat(content, [timeout])](#Client+sendChat) ⇒ <code>Promise</code>
    * [.banUser(userID, [time], [reason])](#Client+banUser) ⇒ <code>Promise</code>
    * [.skipSong(userID, [historyID])](#Client+skipSong) ⇒ <code>Promise</code>
    * [.addUser(userID)](#Client+addUser) ⇒ <code>Promise</code>
    * [.removeUser(userID)](#Client+removeUser) ⇒ <code>Promise</code>
    * [.moveUser(userID, position)](#Client+moveUser) ⇒ <code>Promise</code>
    * [.deleteMessage(chatID)](#Client+deleteMessage) ⇒ <code>Promise</code>
    * ["ready"](#Client+event_ready)
    * ["socketError"](#Client+event_socketError)
    * ["socketClose"](#Client+event_socketClose)
    * ["rawWS"](#Client+event_rawWS)
    * ["connect"](#Client+event_connect)
    * ["chat"](#Client+event_chat)
    * ["chatDelete"](#Client+event_chatDelete)
    * ["guestJoin"](#Client+event_guestJoin)
    * ["userJoin"](#Client+event_userJoin)
    * ["friendJoin"](#Client+event_friendJoin)
    * ["guestLeave"](#Client+event_guestLeave)
    * ["userLeave"](#Client+event_userLeave)
    * ["advance"](#Client+event_advance)
    * ["queueUpdate"](#Client+event_queueUpdate)
    * ["cycleChange"](#Client+event_cycleChange)
    * ["lockChange"](#Client+event_lockChange)
    * ["vote"](#Client+event_vote)

<a name="new_Client_new"></a>

### new Client(email, password, [options])
Create a new Client


| Param | Type | Description |
| --- | --- | --- |
| email | <code>String</code> | The Email to use for login |
| password | <code>String</code> | the password to use |
| [options] | <code>Object</code> | An object containing additional settings |
| [options.useFriends] | <code>Boolean</code> | Whether the bot should distinguish between friends or not |
| [options.autoConnect] | <code>Boolean</code> | If the bot should automatically establish a socket connection |
| [options.autoReconnect] | <code>Boolean</code> | If the bot should automatically reopen an errored or closed socket connection |

<a name="Client+connect"></a>

### client.connect() ⇒ <code>Promise</code>
Establishes the Websocket Conncetion to plug.dj

**Kind**: instance method of <code>[Client](#Client)</code>  
<a name="Client+joinRoom"></a>

### client.joinRoom(slug) ⇒ <code>Promise</code>
Joins a room (community)

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | the slug to join |

<a name="Client+sendChat"></a>

### client.sendChat(content, [timeout]) ⇒ <code>Promise</code>
Sends a message in chat

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | The message content |
| [timeout] | <code>Number</code> | Time after the message is deleted. |

<a name="Client+banUser"></a>

### client.banUser(userID, [time], [reason]) ⇒ <code>Promise</code>
Bans an user from the room.

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userID | <code>Number</code> |  | The id of the user |
| [time] | <code>String</code> | <code>&#x27;d&#x27;</code> | The ban duration, defaults to one day |
| [reason] | <code>Number</code> | <code>1</code> | The ban reason, defaults to 'violating community rules' |

<a name="Client+skipSong"></a>

### client.skipSong(userID, [historyID]) ⇒ <code>Promise</code>
Skip the current playback

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The id of the current dj |
| [historyID] | <code>String</code> | The id of the current playback |

<a name="Client+addUser"></a>

### client.addUser(userID) ⇒ <code>Promise</code>
Adds an user to the queue

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The id of the user to add |

<a name="Client+removeUser"></a>

### client.removeUser(userID) ⇒ <code>Promise</code>
Removes an user from the queue

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The id of the user to be removed |

<a name="Client+moveUser"></a>

### client.moveUser(userID, position) ⇒ <code>Promise</code>
Moves an user in the queue

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The user to move |
| position | <code>Number</code> | The new position of the user |

<a name="Client+deleteMessage"></a>

### client.deleteMessage(chatID) ⇒ <code>Promise</code>
Deletes a chat message

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| chatID | <code>String</code> | Id of the message to be deleted |

<a name="Client+event_ready"></a>

### "ready"
Emitted when the client is ready to make rest calls

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_socketError"></a>

### "socketError"
Emitted when the socket errors

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_socketClose"></a>

### "socketClose"
Emitted when the socket is closed

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data.code | <code>Number</code> | The close code. |
| data.reason | <code>String</code> | A human-readable close reason. |

<a name="Client+event_rawWS"></a>

### "rawWS"
Emits the raw packages.

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data received from plug.dj |

<a name="Client+event_connect"></a>

### "connect"
Emited when the socket connection is up.

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| room | <code>String</code> | The room the client is currently in |

<a name="Client+event_chat"></a>

### "chat"
Emitted when a chat message is received

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>[Message](#Message)</code> | The received message |

<a name="Client+event_chatDelete"></a>

### "chatDelete"
Emitted when a moderator deletes a chat message

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>[Message](#Message)</code> | The deleted message (can be null if message is not cached) |
| The | <code>[User](#User)</code> | user who deleted the message |

<a name="Client+event_guestJoin"></a>

### "guestJoin"
Emitted when a guest joins the room

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_userJoin"></a>

### "userJoin"
Emitted when an users joins the room

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The joined user |

<a name="Client+event_friendJoin"></a>

### "friendJoin"
Emitted when an users joins the room

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The joined user |

<a name="Client+event_guestLeave"></a>

### "guestLeave"
Emitted when a guest leaves the room

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_userLeave"></a>

### "userLeave"
Emitted when an user leaves the room.

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The left user |

<a name="Client+event_advance"></a>

### "advance"
Emitted when a new song is played

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| playback | <code>[Playback](#Playback)</code> | The current playback |
| oldPlayback | <code>[Playback](#Playback)</code> | The playback before. |

<a name="Client+event_queueUpdate"></a>

### "queueUpdate"
Emitted when the waitlist changes

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| queue | <code>[Array.&lt;User&gt;](#User)</code> | The new queue as an array of users |
| oldQueue | <code>[Array.&lt;User&gt;](#User)</code> | The old queue |

<a name="Client+event_cycleChange"></a>

### "cycleChange"
Emitted when the cycle-mode gets changed

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The user who changed the cycle mode |
| state | <code>Boolean</code> | The new cycle-mode |

<a name="Client+event_lockChange"></a>

### "lockChange"
Emitted when the queue gets locked/unlocked/cleared

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The user who took the action |
| lock | <code>Boolean</code> | The new lock-state of the queue |
| clear | <code>Boolean</code> | Wheter the queue got cleared or not |

<a name="Client+event_vote"></a>

### "vote"
Emitted when someone votes on a song

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The user who voted |
| vote | <code>Number</code> | The vote, 1 for woot, -1 for meh |

<a name="Collection"></a>

## Collection ⇐ <code>Map</code>
Hold a bunch of something

**Kind**: global class  
**Extends:** <code>Map</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| baseObject | <code>Class</code> | The base class for all items |
| limit | <code>Number</code> | Max number of items to hold |


* [Collection](#Collection) ⇐ <code>Map</code>
    * [new Collection(baseObject, [limit])](#new_Collection_new)
    * [.add(obj, extra, replace)](#Collection+add) ⇒ <code>Class</code>
    * [.find(func)](#Collection+find) ⇒ <code>Class</code>
    * [.random()](#Collection+random) ⇒ <code>Class</code>
    * [.filter(func)](#Collection+filter) ⇒ <code>Array.&lt;Class&gt;</code>
    * [.map(func)](#Collection+map) ⇒ <code>Array</code>
    * [.update(obj, extra, replace)](#Collection+update) ⇒ <code>Class</code>
    * [.remove(obj)](#Collection+remove) ⇒ <code>Class</code>

<a name="new_Collection_new"></a>

### new Collection(baseObject, [limit])
Construct a Collection


| Param | Type | Description |
| --- | --- | --- |
| baseObject | <code>Class</code> | The base class for all items |
| [limit] | <code>Number</code> | Max number of items to hold |

<a name="Collection+add"></a>

### collection.add(obj, extra, replace) ⇒ <code>Class</code>
Add an object

**Kind**: instance method of <code>[Collection](#Collection)</code>  
**Returns**: <code>Class</code> - The existing or newly created object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object data |
| obj.id | <code>String</code> | The ID of the object |
| extra | <code>Class</code> | An extra parameter the constructor may need |
| replace | <code>Boolean</code> | Whether to replace an existing object with the same ID |

<a name="Collection+find"></a>

### collection.find(func) ⇒ <code>Class</code>
Return the first object to make the function evaluate true

**Kind**: instance method of <code>[Collection](#Collection)</code>  
**Returns**: <code>Class</code> - The first matching object, or undefined if no match  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | A function that takes an object and returns true if it matches |

<a name="Collection+random"></a>

### collection.random() ⇒ <code>Class</code>
Get a random object from the Collection

**Kind**: instance method of <code>[Collection](#Collection)</code>  
**Returns**: <code>Class</code> - The random object, or undefined if there is no match  
<a name="Collection+filter"></a>

### collection.filter(func) ⇒ <code>Array.&lt;Class&gt;</code>
Return all the objects that make the function evaluate true

**Kind**: instance method of <code>[Collection](#Collection)</code>  
**Returns**: <code>Array.&lt;Class&gt;</code> - An array containing all the objects that matched  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | A function that takes an object and returns true if it matches |

<a name="Collection+map"></a>

### collection.map(func) ⇒ <code>Array</code>
Return an array with the results of applying the given function to each element

**Kind**: instance method of <code>[Collection](#Collection)</code>  
**Returns**: <code>Array</code> - An array containing the results  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | A function that takes an object and returns something |

<a name="Collection+update"></a>

### collection.update(obj, extra, replace) ⇒ <code>Class</code>
Update an object

**Kind**: instance method of <code>[Collection](#Collection)</code>  
**Returns**: <code>Class</code> - The updated object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The updated object data |
| obj.id | <code>String</code> | The ID of the object |
| extra | <code>Class</code> | An extra parameter the constructor may need |
| replace | <code>Boolean</code> | Whether to replace an existing object with the same ID |

<a name="Collection+remove"></a>

### collection.remove(obj) ⇒ <code>Class</code>
Remove an object

**Kind**: instance method of <code>[Collection](#Collection)</code>  
**Returns**: <code>Class</code> - The removed object, or null if nothing was removed  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object |
| obj.id | <code>String</code> | The ID of the object |

<a name="Booth"></a>

## Booth
Represents a rooms booth settings

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isLocked | <code>Boolean</code> | Whether the queue is lock or unlocked |
| shouldCycle | <code>Boolean</code> | Whether the queue cycles or not |


* [Booth](#Booth)
    * [.unlock()](#Booth+unlock) ⇒ <code>Promise</code>
    * [.lock()](#Booth+lock) ⇒ <code>Promise</code>
    * [.clear()](#Booth+clear) ⇒ <code>Promise</code>
    * [.enableCycle()](#Booth+enableCycle) ⇒ <code>Promise</code>
    * [.disableCycle()](#Booth+disableCycle) ⇒ <code>Promise</code>

<a name="Booth+unlock"></a>

### booth.unlock() ⇒ <code>Promise</code>
Unlocks the queue

**Kind**: instance method of <code>[Booth](#Booth)</code>  
<a name="Booth+lock"></a>

### booth.lock() ⇒ <code>Promise</code>
Locks the queue

**Kind**: instance method of <code>[Booth](#Booth)</code>  
<a name="Booth+clear"></a>

### booth.clear() ⇒ <code>Promise</code>
Clears and locks the queue

**Kind**: instance method of <code>[Booth](#Booth)</code>  
<a name="Booth+enableCycle"></a>

### booth.enableCycle() ⇒ <code>Promise</code>
Enables queue cycling

**Kind**: instance method of <code>[Booth](#Booth)</code>  
<a name="Booth+disableCycle"></a>

### booth.disableCycle() ⇒ <code>Promise</code>
Disables queue cycling

**Kind**: instance method of <code>[Booth](#Booth)</code>  
<a name="Media"></a>

## Media
Represents a media object

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The unique id used by plug |
| cid | <code>String</code> | The id used by the source. This is only unique if used together with 'format' |
| format | <code>Number</code> | The format of the media. 1 is YouTube, 2 is SoundCloud |
| author | <code>String</code> | The media author |
| title | <code>String</code> | The media title |
| duration | <code>Number</code> | The media duration |
| image | <code>String</code> | A link to a cover image. |
| name | <code>String</code> | The concatenated name of the media |
| uniqueId | <code>String</code> | An unique id for the media |

<a name="Message"></a>

## Message
Represents a single chat message

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | The message content. |
| user | <code>[User](#User)</code> | The user who sent the message. |
| time | <code>Date</code> | The time the message was received. |

<a name="Message+delete"></a>

### message.delete() ⇒ <code>Promise</code>
Deletes this message

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Playback"></a>

## Playback
Represents a Play

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The current history id |
| timestamp | <code>String</code> | The timestamp when the playback started |
| media | <code>[Media](#Media)</code> | The media played |
| user | <code>[User](#User)</code> | The dj |

<a name="Room"></a>

## Room
Represents a room

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The room id |
| slug | <code>String</code> | The room slug |
| name | <code>String</code> | The room name |
| welcomeMessage | <code>String</code> | The welcome message |
| description | <code>String</code> | The room description |
| minChatLevel | <code>Number</code> | The minimal level required to chat |

<a name="User"></a>

## User
Represents a user.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The id of the user. |
| username | <code>String</code> | The name of the user |
| role | <code>Number</code> | The role of the user |
| globalRole | <code>Number</code> | The global role of the user (e.g. Brand Ambassador, Admin) |
| avatarID | <code>String</code> | The avatar of the user |
| badge | <code>String</code> | The badge of the user |
| subscription | <code>String</code> | The subscription type of the user |
| guest | <code>Boolean</code> | Whether the user is a guest or not |
| joined | <code>Date</code> | When the user created his/her account |
| language | <code>String</code> | The users language |
| blurb | <code>String</code> | The users profile description |
| slug | <code>String</code> | A flattend and url-friendly version of the username |
| level | <code>Number</code> | The level of the user |


* [User](#User)
    * [.ban(time, reason)](#User+ban) ⇒ <code>Promise</code>
    * [.mute(time, reason)](#User+mute) ⇒ <code>Promise</code>
    * [.move(position)](#User+move) ⇒ <code>Promise</code>
    * [.add()](#User+add) ⇒ <code>Promise</code>
    * [.remove()](#User+remove) ⇒ <code>Promise</code>

<a name="User+ban"></a>

### user.ban(time, reason) ⇒ <code>Promise</code>
Bans the user from the community

**Kind**: instance method of <code>[User](#User)</code>  

| Param | Type |
| --- | --- |
| time | <code>Number</code> | 
| reason | <code>String</code> | 

<a name="User+mute"></a>

### user.mute(time, reason) ⇒ <code>Promise</code>
Mutes the user

**Kind**: instance method of <code>[User](#User)</code>  

| Param | Type |
| --- | --- |
| time | <code>Number</code> | 
| reason | <code>String</code> | 

<a name="User+move"></a>

### user.move(position) ⇒ <code>Promise</code>
Moves the user in the waitlist

**Kind**: instance method of <code>[User](#User)</code>  

| Param | Type |
| --- | --- |
| position | <code>Number</code> | 

<a name="User+add"></a>

### user.add() ⇒ <code>Promise</code>
Adds the user to the waitlst

**Kind**: instance method of <code>[User](#User)</code>  
<a name="User+remove"></a>

### user.remove() ⇒ <code>Promise</code>
Removes the user from the waitlist

**Kind**: instance method of <code>[User](#User)</code>  
