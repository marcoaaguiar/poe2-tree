import DOMPurify from 'dompurify';
import { type Keyword, type KeywordMap, type Skill, type SkillMap, type TreeNodeData } from '$lib';
import keywordDataJSON from '$lib/data/keywords.json';
import skillDataJSON from '$lib/data/skills.json';

const keywordData = keywordDataJSON as KeywordMap;
const skillData = skillDataJSON as SkillMap;

export function mergeDatas(arrays: any[]): any[] {
	const merged: { [key: string]: any } = {};

	arrays.forEach((v) => {
		const key = v.name; // Assuming `name` is unique for each keyword
		if (!merged[key]) {
			merged[key] = { ...v };
		} else {
			merged[key].nodes = [...new Set([...merged[key].nodes, ...v.nodes])];
		}
	});

	return Object.values(merged);
}

export function getSkillsAndKeywords(
	description: string[],
	nodeId: string
): { keywords: Keyword[]; skills: Skill[] } {
	// get all skills that match and build their description
	let skills = getSkillsForDescription(description, nodeId).map((s) => ({
		...s,
		description: s.stats.join(' ')
	}));
	// get skill descriptions -> to also search in skillDescription for keywords
	const skillDescription = skills.map((s) => s.description).join(' ');
	let keywords = getKeywordsForDescription(
		[skillDescription.concat(description.join(' '))],
		nodeId
	).map((k) => ({ ...k, description: k.stats.join(' ') }));
	return { keywords, skills };
}

export function getDataForDescription(
	data: KeywordMap | SkillMap,
	description: string,
	nodeId: string
): any[] {
	return Object.keys(data)
		.filter((keyword) => description.toLowerCase().includes(keyword.toLowerCase()))
		.map((k) => ({ ...data[k], nodes: [nodeId] }));
}

export function getKeywordsForDescription(description: string[], nodeId: string): Keyword[] {
	let keywords = getDataForDescription(keywordData, description.join(' '), nodeId);
	let keywordKeywords = getDataForDescription(
		keywordData,
		keywords.map((k) => k.stats.join(' ')).join(' '),
		nodeId
	);
	return mergeDatas([...keywords, ...keywordKeywords]);
}

export function getKeywordsForNode(node: TreeNodeData): Keyword[] {
	return getKeywordsForDescription(node.description, node.id);
}

export function getSkillsForNode(node: TreeNodeData): Skill[] {
	return getSkillsForDescription(node.description, node.id);
}

export function getSkillsForDescription(description: string[], nodeId: string): Skill[] {
	let skills = getDataForDescription(skillData, description.join(' '), nodeId);
	return skills;
}

export function highlightKeywords(text: string) {
	return highlight(text, 'is-keyword', keywordData);
}

export function highlightSkills(text: string) {
	return highlight(text, 'is-skill', skillData);
}

export function highlight(text: string, classs: string, data: SkillMap | KeywordMap): string {
	// Create a regex to match all keywords
	const regex = new RegExp(`\\b(${Object.keys(data).join('|')})\\b`, 'gi');
	// Replace matches with underlined HTML
	return text.replace(regex, (match) => `<span class="${classs}">${match}</span>`);
}

export function sanitizeString(text: string): string {
	return DOMPurify.sanitize(text);
}
