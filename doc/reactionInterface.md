# Reaction Interface Documentation

## Table of Contents

- [Module: ReactionInterface](#module-reactioninterface)
  - To be finished

## Module: ReactionInterface

The module uses an unmodified version `BaseModule` class.

### Properties

 * Name: `reactionInterface`
 * Requires: [[`eventExtender`](https://github.com/Damon-Org/EventExtender)]
 * Used Events:
    * `reactionToggle`
    * `reactionAdd`
    * `reactionRemove`

### reactionInterface.createReactionListener(message, emojiResolvable[, reactionType, data, timeout])

- `message` {Discord.Message} The discord message to listen on.
- `emojiResolvable` {Array|string} An array of emojis or string of an emoji to add to the message and listen for.
- `reactionType` {string} The type of reaction to listen for, valid options are "toggle", "add", "remove".
- `data` {*}  Any data to store with the ReactionListener.
- `timeout` {number} The time to listen for reactions, defaults to 30 seconds, give -1 to listen infinitely (make sure you manually do the cleanup).

Returns a [`ReactionListener`]().

### new ReactionListener(reactionInterface, messageId, emojiResolvable, reactionType, data, timeout)

- `reactionInterface` {Class} The ReactionInterface module instance.
- `messageId` {string} The messageId that identifies this ReactionListener.
- `emojiResolvable` {Array|string} The emoji's this ReactionListener will listen to/process.
- `reactionType` {string} A valid ReactionType, valid types are "toggle", "add" and "remove".
- `data` {*} Any data that should be available when handling events.
- `timeout` {number} The timeout when we stop listening and start our cleanup.

This class should not be created directly, if you need an instance please use [reactionInterface.createReactionListener()](#reactioninterface), as this function will do some preparation work before the ReactionListener can be properly used.

### Event: 'reaction'

- `emoji` {string}
- `request` {http.IncomingMessage}

Emitted whenever a reaction is placed on a message.

### Event: 'timeout'

Emitted whenever the ReactionListener is done listening, this may happen even with the reaction listener having received and emitting the reaction event if there was no proper cleanup call after being done.

### reactionListener.cleanup([timeout])

- `timeout` {boolean} Defaults to `false`, set to true to indicate the cleanup was initiated because of a timeout.

Call this method whenever you're done using the ReactionListener, that way all event emitters will be cleaned up and the ReactionListener marked as garbage collectable.

### reactionListener.getData()

Returns the object that was given in the constructor as the data argument.

### reactionListener.reaction(reactionType, emoji, user)

- `reactionType` {number} The numerical value of a reaction type, use the ReactionType constant to parse strings to their numerical value.
- `emoji` {string} The emoji that triggered the reaction.
- `user` {Discord.User} The user that made the reaction.

Do not call this method unless you're trying to manipulate how this class works.
