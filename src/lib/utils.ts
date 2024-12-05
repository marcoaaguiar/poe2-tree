import { type KeywordMap, type SkillMap, type TreeNodeData } from '$lib';
import keywordDataJSON from '$lib/data/keywords.json';
import skillDataJSON from '$lib/data/skills.json';

const keywordData = keywordDataJSON as KeywordMap;
const skillData = skillDataJSON as SkillMap;

export function mergeDatas(arrays: any[]): any[] {
	const merged: { [key: string]: any } = {};

	arrays.flat().forEach((v) => {
		const key = v.name; // Assuming `name` is unique for each keyword
		if (!merged[key]) {
			merged[key] = { ...v };
		} else {
			merged[key].nodes = [...new Set([...merged[key].nodes, ...v.nodes])];
		}
	});

	return Object.values(merged);
}

export function getDataForDescription(
	data: KeywordMap | SkillMap,
	description: string[],
	nodeId: string
): any {
	const keywords =
		description
			.map((line) => {
				// Find keywords that are present in the current line
				const matchedDatas = Object.keys(data).filter((keyword) => line.includes(keyword));

				// Map matched keywords to their data
				return matchedDatas.map((dataKey) => ({ ...data[dataKey], nodes: [nodeId] }));
			})
			.filter((keywords) => keywords.length > 0) || []; // Only keep lines with actual matched keywords
	return mergeDatas(keywords.flat());
}

export function getKeywordsForDescription(description: string[], nodeId: string): any {
	const keywords = getDataForDescription(keywordData, description, nodeId);
	return mergeDatas(keywords.flat()).flat();
}

export function getKeywordsForNode(node: TreeNodeData): any {
	return getKeywordsForDescription(node.description, node.id);
}

export function getSkillsForNode(node: TreeNodeData): any {
	return getSkillsForDescription(node.description, node.id);
}

export function getSkillsForDescription(description: string[], nodeId: string): any {
	const skills = getDataForDescription(skillData, description, nodeId);
	return mergeDatas(skills.flat()).flat();
}

export function highlightKeywords(text: string) {
	return highlight(text, 'is-keyword', keywordData);
}

export function highlightSkills(text: string) {
	return highlight(text, 'is-skill', skillData);
}

export function highlight(text: string, classs: string, data: SkillMap | KeywordMap) {
	// Create a regex to match all keywords
	const regex = new RegExp(`\\b(${Object.keys(data).join('|')})\\b`, 'gi');
	// Replace matches with underlined HTML
	return text.replace(regex, (match) => `<span class="${classs}">${match}</span>`);
}
