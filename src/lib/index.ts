// place files you want to import through the `$lib` alias in this folder.
import nodePositions from '$lib/data/nodes.json';
import nodeData from '$lib/data/nodes_desc.json';
import {
	getKeywordsForDescription,
	getSkillsForDescription,
	highlightKeywords,
	highlightSkills
} from './utils';

interface NodeDataJSON {
	[nodeID: string]: {
		name: string;
		stats: string[];
		skills?: string[];
	};
}

export interface NodePosition {
	x: number;
	y: number;
}

export interface Skill {
	name: string;
	type: string;
	description: string[];
	nodes: string[];
	icon?: string;
}

export interface Keyword {
	name: string;
	description: string[];
	nodes: string[];
}

export interface TreeNodeData {
	id: string;
	type: 'keystone' | 'notable' | 'small';
	position: NodePosition;
	name: string;
	class: string;
	description: string[];
	extraInfo: string[];
	skills: Skill[];
	keywords: Keyword[];
}

export interface KeywordMap {
	[keywordName: string]: Keyword;
}

export interface SkillMap {
	[skillName: string]: Skill;
}

export interface NodeMap {
	[nodeID: string]: TreeNodeData;
}

export interface TreeData {
	nodes: NodeMap;
}

export interface Blinker {
	blinking: Boolean;
}

export interface KeywordBlinker extends Keyword, Blinker {}
export interface SkillBlinker extends Skill, Blinker {}

// massage our 2 data sources into a single map of nodes to simplify our usage.
export function loadData(): TreeData {
	const flattenedNodePositions = [
		...nodePositions.keystones,
		...nodePositions.notables,
		...nodePositions.smalls,
		...nodePositions.ascendancies
	];

	const nodes = flattenedNodePositions.reduce((acc, node) => {
		if (!(nodeData as NodeDataJSON)[node.id]) {
			console.warn(`No data found for node ${node.id}`);

			return acc;
		}

		let { name, stats: description, info } = (nodeData as NodeDataJSON)[node.id];

		const keywords = getKeywordsForDescription(description, node.id);

		const skills = getSkillsForDescription(description, node.id);

		description = description.map((d) => {
			const skills = highlightSkills(d);
			const keyword = highlightKeywords(d);
			return highlightKeywords(highlightSkills(d));
		});

		return {
			...acc,
			[node.id]: {
				id: node.id,
				name,
				description,
				skills,
				keywords,
				type: node.kind,
				class: node.class,
				position: {
					x: node.x,
					y: node.y
				},
				extraInfo: info
			}
		};
	}, {}) as NodeMap;
	return { nodes };
}
