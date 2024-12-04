// place files you want to import through the `$lib` alias in this folder.
import nodePositions from '$lib/data/nodes.json';
import nodeData from '$lib/data/nodes_desc.json';

interface NodeDataJSON {
	[nodeID: string]: {
		name: string;
		stats: string[];
	};
}

export interface NodePosition {
	x: number;
	y: number;
}

export interface TreeNodeData {
	id: string;
	type: 'keystone' | 'notable' | 'small';
	position: NodePosition;
	name: string;
	class: string;
	description: string[];
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

		const { name, stats: description } = (nodeData as NodeDataJSON)[node.id];

		return {
			...acc,
			[node.id]: {
				id: node.id,
				name,
				description,
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
