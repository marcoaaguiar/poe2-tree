// place files you want to import through the `$lib` alias in this folder.
import nodePositions from '$lib/data/nodes.json';
import nodeData from '$lib/data/nodes_desc.json';
import {
	getKeywordsForDescription,
	getSkillsAndKeywords,
	getSkillsForDescription,
	highlightKeywords,
	highlightSkills,
	mergeDatas
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
	description: string;
	stats: string[];
	nodes: string[];
	icon?: string;
}

export interface Keyword {
	name: string;
	description: string;
	stats: string[];
	nodes: string[];
}

export interface TreeNodeData {
	id: string;
	type: 'keystone' | 'notable' | 'small';
	position: NodePosition;
	name: string;
	class: string;
	description: string[];
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

		let { name, stats: description } = (nodeData as NodeDataJSON)[node.id];

		// process NodeData, extract skills and keywords from description
		let { keywords, skills } = getSkillsAndKeywords(description, node.id);
		// highlight skills and keywords in the description texts
		description = description.map((d) => highlightKeywords(highlightSkills(d)));
		skills = skills.map((s) => ({
			...s,
			description: highlightKeywords(highlightSkills(s.stats.join(' ')))
		}));
		keywords = keywords.map((k) => ({
			...k,
			description: highlightKeywords(highlightSkills(k.stats.join(' ')))
		}));

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
				}
			}
		};
	}, {}) as NodeMap;
	return { nodes };
}
