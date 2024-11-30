# Path of Exile 2 - Skill Tree

This is a scuffed version of the Path of Exile 2 skill tree with data extracted from videos and screenshots. It's a community project so feel free to contribute.

# Contributing

If you want to contribute to the project there are a few ways to help

- Finding new sources
- Transcribing nodes from the mapped sources
- Improve the UI/UX

## Finding new sources

If you found a new source that is not listed on this README as mapped or is up for mapping on the issues, please open an issue with the link to the video or screenshot.

## Transcribing nodes

Adding information nodes is quite simple

1. Open the skill tree and hover the mouse over the node you want to transcribe, it will show the node id if it has not been transcribed yet.

2. Go to the `src/lib/data/nodes_desc.json` and search for the node id and edit the entry with the information you found.

Example:

```json
{
  ...
  "N152": {
    "name": "Name of the node",
    "stats": [
      "First line of stats",
      "Second line of stats"
    ]
  },
  ...
}
```

3. Validate that you change the correct entry

4. Add the source to the list of mapped sources, if its a screenshot make sure to add it to you pull request

5. Open a Pull Request

## Improving the UI/UX

The UI/UX is quite basic and can be improved in many ways, if you have any ideas feel free to open an issue or a pull request.

# Mapped Sources

## Dreamcore YouTube

- [Int Area](https://www.youtube.com/watch?v=tI0xJb1HEYw)
- [Int/Dex Area](https://www.youtube.com/watch?v=aTi9fF6fU24)
- [Str/Int Area](https://www.youtube.com/watch?v=XfriM2XvruQb)
- [Dex Area](https://www.youtube.com/watch?v=WmAI31iog94)
- [Dex/Str Area](https://www.youtube.com/watch?v=YOQlMiDNpyQ)

## Bajheera Youtube

- [Str/Dex Area](https://www.youtube.com/watch?v=Ec_06V4NOWc)

## Blupa Figma Tree

- [Figma Tree](https://www.figma.com/design/RDJYoGyidY3Xsc21HjcY31/Figma-basics)

## Path of Exile 2: Endgame Content Reveal

- [Mixed Area](https://www.youtube.com/watch?v=ZpIbaTXJD4g&t=1356s)

## Moxsy YouTube

- [Int/Dex Area](https://youtu.be/LRL30Ib9RIU?si=EWwrFOF-s8jizDtI&t=1149)

# Sources to map

## Dreamcore Youtube

- [Str Area](https://www.youtube.com/watch?v=yPh98i0-oHs)
