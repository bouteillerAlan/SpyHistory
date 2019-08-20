# SpyHistory
> Front of the app

## Mapping for personal story
[reference](https://wiki.guildwars2.com/wiki/Guild_Wars_2_Wiki:Projects/Personal_storyline/visual_overview)

Available in ``ressources\personal_story_id_map.xlsx``.

## backStories_line.js
This file is made for check if story id is authorized or not according to the choices made during the creation of the character.

It's an object that contains in index the id of the choice and in parameter an array which contains the id that the player will not be able to do if he made this choice.

*Why?*

The player's choices only impact certain parts of the quests and most seasons are unaffected by the choices.
It's therefore simpler to say which one is forbidden than to list all the authorized quests.

Example : 

```js
// human choices
// 124,116,113,111,112,114
'21-105' : [123,109,106,108,107,110, 115,118,119,120,121,122],
// 123,109,106,108,107,110
'21-106' : [124,116,113,111,112,114, 115,118,119,120,121,122],
// 115,118,119,120,121,122
'21-107' : [123,109,106,108,107,110, 124,116,113,111,112,114],
// 125,126,127,128,139
'22-109' : [134,135,137,136,138, 129,130,132,131,133],
// 134,135,137,136,138
'22-110' : [125,126,127,128,139, 129,130,132,131,133],
// 129,130,132,131,133
'22-108' : [125,126,127,128,139, 134,135,137,136,138],
```

## quests_line.js
> **All id are sorted in order of in game quests**

This file is used to generate the view in each card.

The display is generated automatically thanks to the table. They must be built according to the desired view, for example:

```
'index' : [
    [ <- rows
        [1] <- columns
    ],
    [
        [5, 6] <- columns
        [2, [3,4]] <- columns with 2 rows choices
    ]
]
give :
    [1]
 [5]   [2]
 [6]  [3][4]
```

In this file we also find : 
 - ``2choice`` Quest list that precedes a two-way choice
 - ``3choice`` list of quests that precedes a choice with three options
 - ``5choice`` Quest list that precedes a five-choice choice
 - ``durmand`` list of quests that belong to the Priory of Durmand
 - ``whisper`` list of quests that belong to the Whisper
 - ``vigil`` list of quests that belong to the Vigil

## tuto_line.js
This file is used to map the correct tutorial link for each seasons and map.

Example : 
```
// season
// My Story
'215AAA0F-CDAC-4F93-86DA-C155A99B5784' : 'link',
```

## API request
All api request as made on ``function`` folder. 
