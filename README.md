# ReactionInterface Module

This is a module used by Damon Music.

## Example Usage

For an in depth documentation of what each method does, scroll down to the documentation.
```js
const serverMember = msgObj.member;

const emojis = ['✅', '❎'];

const reactionInterface = this._m.getModule('reactionInterface');
const reactionListener = reactionInterface.createReactionListener(newMsg, emojis, 'add', {
    data,
    exception,
    msgObj
}, 30e3);

reactionListener.on('reaction', async (emoji, user) => {
    // Check if the reaction came from a specific user
    // you can omit this check depending on your use case
    if (serverMember.user.id != user.id) return;

    // Currently you still have to manually call cleanup after you're done using the reactionListener
    reactionListener.cleanup();

    // You can retrieve your stored data from the reactionListener whenever you need it
    const { data, exception, msgObj } = reactionListener.getData();

    msgObj.delete();

    if (emoji == emojis[0]) {
        for (let i = 0; i < data.length; i++) {
            const song = new LavaTrack(data[i]);
            if (!await this.handleSongData(song, serverMember, msgObj, voiceChannel, null, false, false)) break;
        }

        msgObj.channel.send('Successfully added playlist!');

        return;
    }
});

// By default the timeout is 30 seconds
reactionListener.on('timeout', () => {
    // The user/any user failed to respond within the given timeout period
});
```

## Documentation

See [`/doc/reactionInterface.md`](./doc/reactionInterface.md) for a Node.js like documentation.
