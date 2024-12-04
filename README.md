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

- [Dreamcore - Corrupting Cry Theorycraft](https://www.youtube.com/watch?v=qljbdX5HyYQ)
- [Dreamcore - Int Area](https://www.youtube.com/watch?v=tI0xJb1HEYw)
- [Dreamcore - Int/Dex Area](https://www.youtube.com/watch?v=aTi9fF6fU24)
- [Dreamcore - Str Area](https://www.youtube.com/watch?v=yPh98i0-oHs)
- [Dreamcore - Str/Int Area](https://www.youtube.com/watch?v=XfriM2XvruQb)
- [Dreamcore - Dex Area](https://www.youtube.com/watch?v=WmAI31iog94)
- [Dreamcore - Dex/Str Area](https://www.youtube.com/watch?v=YOQlMiDNpyQ)
- [Bajheera - Str/Dex Area](https://www.youtube.com/watch?v=Ec_06V4NOWc)
- [Blupa - Figma Tree](https://www.figma.com/design/RDJYoGyidY3Xsc21HjcY31/Figma-basics)
- [Havoc - Mercenary Gameplay](https://www.youtube.com/watch?v=MLUfCNS7Pgo)
- [Moxsy - Int/Dex Area](https://youtu.be/LRL30Ib9RIU?si=EWwrFOF-s8jizDtI&t=1149)
- [MrRonit - Mobalytics Planner](https://www.youtube.com/watch?v=knx_VyDGYSw)
- [Ziggyd - Mercenary Showcase](https://www.youtube.com/watch?v=fLP1oODaZTE)
- [Open World Games - Reveal](https://www.youtube.com/watch?v=-v2UqGMmldc)
- [GGG - Endgame Reveal](https://www.youtube.com/watch?v=ZpIbaTXJD4g&t=1356s)
- [GGG - Exilecon](https://www.youtube.com/watch?v=y8OL9qqnhDo)
- [GGG - Ascendancy Reveal](https://www.pathofexile.com/forum/view-thread/3592012)

# Contributors

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/marcoaaguiar">
                    <img src="https://avatars.githubusercontent.com/u/7772685?v=4" width="100;" alt="marcoaaguiar"/>
                    <br />
                    <sub><b>Marco Aguiar</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Giusti">
                    <img src="https://avatars.githubusercontent.com/u/6214919?v=4" width="100;" alt="Giusti"/>
                    <br />
                    <sub><b>Giusti</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/lfmnovaes">
                    <img src="https://avatars.githubusercontent.com/u/13990675?v=4" width="100;" alt="lfmnovaes"/>
                    <br />
                    <sub><b>Luís Fernando Novaes</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/thorgalti">
                    <img src="https://avatars.githubusercontent.com/u/190164545?v=4" width="100;" alt="thorgalti"/>
                    <br />
                    <sub><b>thorgalti</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Kehrweek">
                    <img src="https://avatars.githubusercontent.com/u/37820515?v=4" width="100;" alt="Kehrweek"/>
                    <br />
                    <sub><b>Benjamin Saur</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/meatwallace">
                    <img src="https://avatars.githubusercontent.com/u/3013783?v=4" width="100;" alt="meatwallace"/>
                    <br />
                    <sub><b>Geoff Whatley</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/neo-daru">
                    <img src="https://avatars.githubusercontent.com/u/137759704?v=4" width="100;" alt="neo-daru"/>
                    <br />
                    <sub><b>Daru</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/azadix">
                    <img src="https://avatars.githubusercontent.com/u/3746879?v=4" width="100;" alt="azadix"/>
                    <br />
                    <sub><b>Geoff Whatley</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Chizinha">
                    <img src="https://avatars.githubusercontent.com/u/16880563?v=4" width="100;" alt="Chizinha"/>
                    <br />
                    <sub><b>Chizinha</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/mortslhawmit">
                    <img src="https://avatars.githubusercontent.com/u/30402832?v=4" width="100;" alt="mortslhawmit"/>
                    <br />
                    <sub><b>mortslhawmit</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/mizm0">
                    <img src="https://avatars.githubusercontent.com/u/190132103?v=4" width="100;" alt="mizm0"/>
                    <br />
                    <sub><b>mizm0</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/theshannon">
                    <img src="https://avatars.githubusercontent.com/u/33788533?v=4" width="100;" alt="theshannon"/>
                    <br />
                    <sub><b>Shannon Pereira</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/Darxo">
                    <img src="https://avatars.githubusercontent.com/u/2252464?v=4" width="100;" alt="Darxo"/>
                    <br />
                    <sub><b>Darxo</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Alexis-Pannetier">
                    <img src="https://avatars.githubusercontent.com/u/35290061?v=4" width="100;" alt="Alexis-Pannetier"/>
                    <br />
                    <sub><b>Alexis Pannetier</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Bolado">
                    <img src="https://avatars.githubusercontent.com/u/74077743?v=4" width="100;" alt="Bolado"/>
                    <br />
                    <sub><b>Igor</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Yamarin">
                    <img src="https://avatars.githubusercontent.com/u/6870612?v=4" width="100;" alt="Yamarin"/>
                    <br />
                    <sub><b>Yamarin</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/shawnkfox">
                    <img src="https://avatars.githubusercontent.com/u/190136877?v=4" width="100;" alt="shawnkfox"/>
                    <br />
                    <sub><b>shawnkfox</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/josephjaniga">
                    <img src="https://avatars.githubusercontent.com/u/4117680?v=4" width="100;" alt="josephjaniga"/>
                    <br />
                    <sub><b>Joe</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/SoonDead">
                    <img src="https://avatars.githubusercontent.com/u/988167?v=4" width="100;" alt="SoonDead"/>
                    <br />
                    <sub><b>Márton Vincze</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/wow-thats-amazing">
                    <img src="https://avatars.githubusercontent.com/u/190570153?v=4" width="100;" alt="wow-thats-amazing"/>
                    <br />
                    <sub><b>wow-thats-amazing</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/MrCatFace515">
                    <img src="https://avatars.githubusercontent.com/u/48973217?v=4" width="100;" alt="MrCatFace515"/>
                    <br />
                    <sub><b>MrCatFace515</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Saullasky">
                    <img src="https://avatars.githubusercontent.com/u/100862483?v=4" width="100;" alt="Saullasky"/>
                    <br />
                    <sub><b>GregoireS</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/danielbruni">
                    <img src="https://avatars.githubusercontent.com/u/8276922?v=4" width="100;" alt="danielbruni"/>
                    <br />
                    <sub><b>Daniel-Bruni Ziermann</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/conradte3">
                    <img src="https://avatars.githubusercontent.com/u/9290553?v=4" width="100;" alt="conradte3"/>
                    <br />
                    <sub><b>Conrad</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/timwahlstrom">
                    <img src="https://avatars.githubusercontent.com/u/121232783?v=4" width="100;" alt="timwahlstrom"/>
                    <br />
                    <sub><b>timwahlstrom</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/moethelion">
                    <img src="https://avatars.githubusercontent.com/u/41308628?v=4" width="100;" alt="moethelion"/>
                    <br />
                    <sub><b>moethelion</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/maksim789456">
                    <img src="https://avatars.githubusercontent.com/u/8225008?v=4" width="100;" alt="maksim789456"/>
                    <br />
                    <sub><b>maksim789456</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/kky1997">
                    <img src="https://avatars.githubusercontent.com/u/100503676?v=4" width="100;" alt="kky1997"/>
                    <br />
                    <sub><b>Kai</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Xeko-92">
                    <img src="https://avatars.githubusercontent.com/u/123136614?v=4" width="100;" alt="Xeko-92"/>
                    <br />
                    <sub><b>Xeko</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/tungchui">
                    <img src="https://avatars.githubusercontent.com/u/15983523?v=4" width="100;" alt="tungchui"/>
                    <br />
                    <sub><b>Tung Chui</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/Shryver">
                    <img src="https://avatars.githubusercontent.com/u/2012046?v=4" width="100;" alt="Shryver"/>
                    <br />
                    <sub><b>Shryver</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ryanlee-ei">
                    <img src="https://avatars.githubusercontent.com/u/72424672?v=4" width="100;" alt="ryanlee-ei"/>
                    <br />
                    <sub><b>ryanlee-ei</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/midastouchprd">
                    <img src="https://avatars.githubusercontent.com/u/18386032?v=4" width="100;" alt="midastouchprd"/>
                    <br />
                    <sub><b>Tosin Awofeso</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/mmhchan">
                    <img src="https://avatars.githubusercontent.com/u/18507372?v=4" width="100;" alt="mmhchan"/>
                    <br />
                    <sub><b>Michael Chan</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Trifall">
                    <img src="https://avatars.githubusercontent.com/u/13270623?v=4" width="100;" alt="Trifall"/>
                    <br />
                    <sub><b>Jerren T</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/JaredRabie">
                    <img src="https://avatars.githubusercontent.com/u/20741149?v=4" width="100;" alt="JaredRabie"/>
                    <br />
                    <sub><b>JaredRabie</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/GVonB">
                    <img src="https://avatars.githubusercontent.com/u/36426938?v=4" width="100;" alt="GVonB"/>
                    <br />
                    <sub><b>Gunnar Von Bergen</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Gardien1">
                    <img src="https://avatars.githubusercontent.com/u/43163679?v=4" width="100;" alt="Gardien1"/>
                    <br />
                    <sub><b>Gardien1</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/hueb1337">
                    <img src="https://avatars.githubusercontent.com/u/53821392?v=4" width="100;" alt="hueb1337"/>
                    <br />
                    <sub><b>Fabian Hueber</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/korcsogb">
                    <img src="https://avatars.githubusercontent.com/u/50313809?v=4" width="100;" alt="korcsogb"/>
                    <br />
                    <sub><b>Balazs Korcsog</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->
