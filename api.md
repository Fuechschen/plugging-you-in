## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd><p>The main Client object</p>
</dd>
<dt><a href="#Collection">Collection</a> ⇐ <code>Map</code></dt>
<dd><p>Hold a bunch of something</p>
</dd>
<dt><a href="#Ban">Ban</a></dt>
<dd><p>Represents a ban</p>
</dd>
<dt><a href="#Booth">Booth</a></dt>
<dd><p>Represents a rooms booth settings</p>
</dd>
<dt><a href="#ExtendedUser">ExtendedUser</a></dt>
<dd><p>An user with more information</p>
</dd>
<dt><a href="#Media">Media</a></dt>
<dd><p>Represents a media object</p>
</dd>
<dt><a href="#Message">Message</a></dt>
<dd><p>Represents a single chat message</p>
</dd>
<dt><a href="#MinimalUser">MinimalUser</a></dt>
<dd><p>An user with the minimum of information plug gives</p>
</dd>
<dt><a href="#Playback">Playback</a></dt>
<dd><p>Represents a Play</p>
</dd>
<dt><a href="#Queue">Queue</a></dt>
<dd><p>Represents the queue of a room</p>
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
| room | <code>[Room](#Room)</code> | The current room |
| socketStatus | <code>String</code> | The current status of the socket connection |
| self | <code>[ExtendedUser](#ExtendedUser)</code> | The logged-in user |


* [Client](#Client)
    * [new Client(email, password, [options])](#new_Client_new)
    * [.connect()](#Client+connect) ⇒ <code>Promise</code>
    * [.joinRoom(slug)](#Client+joinRoom) ⇒ <code>Promise</code>
    * [.sendChat(content)](#Client+sendChat) ⇒ <code>Promise</code>
    * [.banUser(userID, [time], [reason])](#Client+banUser) ⇒ <code>Promise</code>
    * [.unbanUser(userID)](#Client+unbanUser) ⇒ <code>Promise</code>
    * [.skipSong([userID], [historyID])](#Client+skipSong) ⇒ <code>Promise</code>
    * [.deleteMessage(chatID)](#Client+deleteMessage) ⇒ <code>Promise</code>
    * [.setRole(userID, role)](#Client+setRole) ⇒ <code>Promise</code>
    * [.removeRole(userID)](#Client+removeRole) ⇒ <code>Promise</code>
    * ["ready"](#Client+event_ready)
    * ["joinedRoom"](#Client+event_joinedRoom)
    * ["socketError"](#Client+event_socketError)
    * ["socketClose"](#Client+event_socketClose)
    * ["rawWS"](#Client+event_rawWS)
    * ["unknown"](#Client+event_unknown)
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
    * ["floodApi"](#Client+event_floodApi)
    * ["floodChat"](#Client+event_floodChat)
    * ["slowMode"](#Client+event_slowMode)
    * ["earn"](#Client+event_earn)
    * ["gifted"](#Client+event_gifted)
    * ["ban"](#Client+event_ban)
    * ["addDj"](#Client+event_addDj)
    * ["userBan"](#Client+event_userBan)
    * ["moveUser"](#Client+event_moveUser)
    * ["skip"](#Client+event_skip)
    * ["killSession"](#Client+event_killSession)
    * ["error"](#Client+event_error)
    * ["levelUp"](#Client+event_levelUp)
    * ["maintenance"](#Client+event_maintenance)
    * ["maintenanceAlert"](#Client+event_maintenanceAlert)
    * ["plugMessage"](#Client+event_plugMessage)
    * ["plugUpdate"](#Client+event_plugUpdate)
    * ["selfSkip"](#Client+event_selfSkip)

<a name="new_Client_new"></a>

### new Client(email, password, [options])
Create a new Client


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| email | <code>String</code> |  | The Email to use for login |
| password | <code>String</code> |  | the password to use |
| [options] | <code>Object</code> |  | An object containing additional settings |
| [options.useFriends] | <code>Boolean</code> | <code>false</code> | Whether the bot should distinguish between friends or not |
| [options.autoConnect] | <code>Boolean</code> | <code>false</code> | If the bot should automatically establish a socket connection |
| [options.autoReconnect] | <code>Boolean</code> | <code>false</code> | If the bot should automatically reopen an errored or closed socket connection |
| [options.requestFreeze] | <code>Number</code> | <code>1000</code> | The time all requests are freezed when a ratelimit warning is received. Can not be lower than 1 |
| [options.chatFreeze] | <code>Number</code> | <code>1000</code> | The time all chatmessages are freezed when receiving a "floodChat" event |
| [options.ignoreRateLimits] | <code>Boolean</code> | <code>false</code> | Whether to respect plug.dj's rate limits or not. It's not recommended to use this option except when you are having your own handling for rate limits. |
| [options.updateNotification] | <code>Boolean</code> | <code>false</code> | Whether you want to notified about (possible) updates. |

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

### client.sendChat(content) ⇒ <code>Promise</code>
Sends a message in chat

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | The message content |

<a name="Client+banUser"></a>

### client.banUser(userID, [time], [reason]) ⇒ <code>Promise</code>
Bans an user from the room.

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userID | <code>Number</code> |  | The id of the user |
| [time] | <code>String</code> | <code>&#x27;d&#x27;</code> | The ban duration, defaults to one day ('h' for one hour, 'd' for a day, 'f' for forever) |
| [reason] | <code>Number</code> | <code>1</code> | The ban reason, defaults to 'violating community rules' |

<a name="Client+unbanUser"></a>

### client.unbanUser(userID) ⇒ <code>Promise</code>
Removes a ban for a user

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The id of the user |

<a name="Client+skipSong"></a>

### client.skipSong([userID], [historyID]) ⇒ <code>Promise</code>
Skips the current playback. All fields are automatically filled in, however it is recommended to provide at least the userID to prevent wrong skips

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [userID] | <code>Number</code> | The id of the current dj |
| [historyID] | <code>String</code> | The id of the current playback |

<a name="Client+deleteMessage"></a>

### client.deleteMessage(chatID) ⇒ <code>Promise</code>
Deletes a chat message

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| chatID | <code>String</code> | Id of the message to be deleted |

<a name="Client+setRole"></a>

### client.setRole(userID, role) ⇒ <code>Promise</code>
Sets an user as staff

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> |  |
| role | <code>Number</code> | the role, 0 for grey, 1 for res dj, 2 for bouncer, 3 for manager, 4 for co-host, 5 for host |

<a name="Client+removeRole"></a>

### client.removeRole(userID) ⇒ <code>Promise</code>
Shorthand for {Client}.setRole(userID, 0)

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type |
| --- | --- |
| userID | <code>Number</code> | 

<a name="Client+event_ready"></a>

### "ready"
Emitted when the client is ready to make rest calls

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_joinedRoom"></a>

### "joinedRoom"
Emitted when a room was joined and the caches were filled.

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

<a name="Client+event_unknown"></a>

### "unknown"
Emitted when an unknown package is received from plug. This can indicate an outdated version of plugging-you-in

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_connect"></a>

### "connect"
Emitted when the socket connection is up.

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

<a name="Client+event_floodApi"></a>

### "floodApi"
Emitted when too many api requests are fired. You don't need to handle it if you leave `options.requestFreeze` at the default value, however all actions will be stopped for 10 seconds

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_floodChat"></a>

### "floodChat"
Emitted when you are sending too many chat messages and plugging-you-in isn't good enough at limiting you. Plugging-you-in will handle this by stopping to send messages entirely for a few seconds

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_slowMode"></a>

### "slowMode"
Emitted when chat enters slow mode.

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_earn"></a>

### "earn"
Emitted when the bot earns experience/plug points or levels up

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| earn | <code>Object</code> |  |
| earn.xp | <code>Number</code> | The new amount of xp |
| earn.pp | <code>Number</code> | The new amount of plug points |
| earn.level | <code>Number</code> | The new level |

<a name="Client+event_gifted"></a>

### "gifted"
Emitted when someone gifts plug points to someone

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| sender | <code>[User](#User)</code> | The user who sent the gift |
| receiver | <code>[User](#User)</code> | The user who received the gift |

<a name="Client+event_ban"></a>

### "ban"
Emitted when you are banned from a community

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ban | <code>[Ban](#Ban)</code> | The ban object |

<a name="Client+event_addDj"></a>

### "addDj"
Emitted when a moderator adds someone to the queue. This also fires a queueUpdate-event

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The user who got added |
| moderator | <code>[User](#User)</code> | The Moderator |

<a name="Client+event_userBan"></a>

### "userBan"
Emitted when a moderator bans someone from the room

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ban | <code>[Ban](#Ban)</code> | The ban |
| moderator | <code>[User](#User)</code> |  |

<a name="Client+event_moveUser"></a>

### "moveUser"
Emitted when a moderator moves someone in the queue. This also fires a queueUpdate-event

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>[User](#User)</code> | The moved user |
| moderator | <code>[User](#User)</code> |  |
| newPosition | <code>Number</code> |  |
| oldPosition | <code>Number</code> |  |

<a name="Client+event_skip"></a>

### "skip"
Emitted when a moderator skips a song

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type |
| --- | --- |
| moderator | <code>[User](#User)</code> | 

<a name="Client+event_killSession"></a>

### "killSession"
Emitted when the socket server kills the session

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_error"></a>

### "error"
Emitted when the client encounters an error which it cannot handle itself

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| error | <code>String</code> &#124; <code>Error</code> | The error or an error message. |
| err | <code>Error</code> | An error object |

<a name="Client+event_levelUp"></a>

### "levelUp"
Emitted when the logged in account levels up

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type |
| --- | --- |
| newLevel | <code>Number</code> | 

<a name="Client+event_maintenance"></a>

### "maintenance"
Emitted when plug.dj goes into maintenance mode

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_maintenanceAlert"></a>

### "maintenanceAlert"
Emitted when plug.dj is about to go into maintenance mode

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| time | <code>Number</code> | time til maintenance mode in minutes |

<a name="Client+event_plugMessage"></a>

### "plugMessage"
Emitted when plug.dj sends a broadcast

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type |
| --- | --- |
| message | <code>String</code> | 

<a name="Client+event_plugUpdate"></a>

### "plugUpdate"
Emitted when plig.dj gets updated.

**Kind**: event emitted by <code>[Client](#Client)</code>  
<a name="Client+event_selfSkip"></a>

### "selfSkip"
Emitted when someone skips himself

**Kind**: event emitted by <code>[Client](#Client)</code>  
**Properties**

| Name | Type |
| --- | --- |
| user | <code>[User](#User)</code> | 

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

<a name="Ban"></a>

## Ban
Represents a ban

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| duration | <code>String</code> | The ban duration ('h' for one hour, 'd' for a day, 'f' for forever) |

<a name="Ban+remove"></a>

### ban.remove() ⇒ <code>Promise</code>
Removes this ban.

**Kind**: instance method of <code>[Ban](#Ban)</code>  
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
<a name="ExtendedUser"></a>

## ExtendedUser
An user with more information

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | An object containing settings |
| plugPoints | <code>Number</code> | The current amount of plug points the user has |
| xp | <code>Number</code> | The current number of experience points the user has |
| ignores | <code>[Array.&lt;MinimalUser&gt;](#MinimalUser)</code> | An array of users the current user ignores |

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
| mentioned | <code>Boolean</code> | Indicates if the bot was mentioned |

<a name="Message+delete"></a>

### message.delete() ⇒ <code>Promise</code>
Deletes this message

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="MinimalUser"></a>

## MinimalUser
An user with the minimum of information plug gives

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The id of the user. |
| username | <code>String</code> | The name of the user |


* [MinimalUser](#MinimalUser)
    * [.ban(time, reason)](#MinimalUser+ban) ⇒ <code>Promise</code>
    * [.unban()](#MinimalUser+unban) ⇒ <code>Promise</code>
    * [.setRole(role)](#MinimalUser+setRole) ⇒ <code>Promise</code>
    * [.removeRole()](#MinimalUser+removeRole) ⇒ <code>Promise</code>

<a name="MinimalUser+ban"></a>

### minimalUser.ban(time, reason) ⇒ <code>Promise</code>
Bans the user from the community

**Kind**: instance method of <code>[MinimalUser](#MinimalUser)</code>  

| Param | Type |
| --- | --- |
| time | <code>String</code> | 
| reason | <code>Number</code> | 

<a name="MinimalUser+unban"></a>

### minimalUser.unban() ⇒ <code>Promise</code>
Unbans the user from the community

**Kind**: instance method of <code>[MinimalUser](#MinimalUser)</code>  
<a name="MinimalUser+setRole"></a>

### minimalUser.setRole(role) ⇒ <code>Promise</code>
Sets the user as staff

**Kind**: instance method of <code>[MinimalUser](#MinimalUser)</code>  

| Param | Type | Description |
| --- | --- | --- |
| role | <code>Number</code> | the role, 0 for grey, 1 for res dj, 2 for bouncer, 3 for manager, 4 for co-host, 5 for host |

<a name="MinimalUser+removeRole"></a>

### minimalUser.removeRole() ⇒ <code>Promise</code>
Shorthand for {MinimalUser}.setStaff(0)

**Kind**: instance method of <code>[MinimalUser](#MinimalUser)</code>  
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

<a name="Queue"></a>

## Queue
Represents the queue of a room

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| queue | <code>[Array.&lt;User&gt;](#User)</code> | An ordered array of users being in the queue |


* [Queue](#Queue)
    * [.addUser(userID)](#Queue+addUser) ⇒ <code>Promise</code>
    * [.removeUser(userID)](#Queue+removeUser) ⇒ <code>Promise</code>
    * [.moveUser(userID, position)](#Queue+moveUser) ⇒ <code>Promise</code>
    * [.lock()](#Queue+lock) ⇒ <code>Promise</code>
    * [.unlock()](#Queue+unlock) ⇒ <code>Promise</code>
    * [.clear()](#Queue+clear) ⇒ <code>Promise</code>

<a name="Queue+addUser"></a>

### queue.addUser(userID) ⇒ <code>Promise</code>
Adds an user to the queue

**Kind**: instance method of <code>[Queue](#Queue)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The id of the user to add |

<a name="Queue+removeUser"></a>

### queue.removeUser(userID) ⇒ <code>Promise</code>
Removes an user from the queue

**Kind**: instance method of <code>[Queue](#Queue)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The id of the user to be removed |

<a name="Queue+moveUser"></a>

### queue.moveUser(userID, position) ⇒ <code>Promise</code>
Moves an user in the queue

**Kind**: instance method of <code>[Queue](#Queue)</code>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>Number</code> | The user to move |
| position | <code>Number</code> | The new position of the user |

<a name="Queue+lock"></a>

### queue.lock() ⇒ <code>Promise</code>
Locks the queue

**Kind**: instance method of <code>[Queue](#Queue)</code>  
<a name="Queue+unlock"></a>

### queue.unlock() ⇒ <code>Promise</code>
Unlocks the queue

**Kind**: instance method of <code>[Queue](#Queue)</code>  
<a name="Queue+clear"></a>

### queue.clear() ⇒ <code>Promise</code>
Clears and locks the queue

**Kind**: instance method of <code>[Queue](#Queue)</code>  
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
| mention | <code>String</code> | The mention for that user |


* [User](#User)
    * [.mute(time, reason)](#User+mute) ⇒ <code>Promise</code>
    * [.move(position)](#User+move) ⇒ <code>Promise</code>
    * [.add()](#User+add) ⇒ <code>Promise</code>
    * [.remove()](#User+remove) ⇒ <code>Promise</code>

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
