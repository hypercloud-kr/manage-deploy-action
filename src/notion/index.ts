import { Client } from "@notionhq/client";
import { Block, BlockWithChildren } from "../types/notion-block";
import { DatabaseProperties } from "../types/notion";
import {getInput} from "@actions/core";

// Reference
// https://dev.to/martinp/use-notion-as-a-database-for-your-nextjs-blog-195p

const NOTION_TOKEN = getInput('notion-token', { required: true });
export const notion = new Client({
	auth: NOTION_TOKEN,
});
export const getBlocks = async (blockId: string): Promise<Block[]> => {
	const blocks: Block[] = [];
	let response = await notion.blocks.children.list({
		block_id: blockId,
		page_size: 25,
	});

	response.results.map((block) => {
		blocks.push(block as Block);
	});
	while (response.has_more && response.next_cursor) {
		response = await notion.blocks.children.list({
			block_id: blockId,
			page_size: 25,
			start_cursor: response.next_cursor,
		});
		response.results.map((block) => {
			blocks.push(block as Block);
		});
	}
	return blocks;
};

const getChildren = async (block: Block): Promise<BlockWithChildren> => {
	const children: BlockWithChildren[] = [];
	if (block.has_children) {
		const childBlocks = await getBlocks(block.id);
		const childBlocksWithChildren = await Promise.all(
			childBlocks.map(async (block) => await getChildren(block)),
		);
		childBlocksWithChildren.map((block: BlockWithChildren) => {
			children.push(block);
		});
	}
	const ablock: BlockWithChildren = {
		...block,
		childblocks: children,
	};
	return ablock;
};

export const getPageBlocks = async (
	pageId: string,
): Promise<BlockWithChildren[]> => {
	const blocks: Block[] = await getBlocks(pageId);
	const blocksWithChildren: BlockWithChildren[] = await Promise.all(
		blocks.map(async (block: Block) => {
			const blockWithChildren = await getChildren(block);
			return blockWithChildren;
		}),
	);
	return blocksWithChildren;
};

export function transformDBRow<T, R>(item: DatabaseProperties & T): R {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(item.properties)) {
		const { type } = value;

		// TODO: 기본값을 어떻게 처리하면 좋을지 생각해보기
		switch (type) {
			case "title":
				result[key] = value.title[0]?.plain_text || "";
				break;
			case "rich_text":
				result[key] = value.rich_text[0]?.plain_text || "";
				break;
			case "date":
				result[key] = value.date.start || "";
				break;
			case "select":
				result[key] = value.select.name || "";
				break;
			case "files":
				result[key] = value.files[0]?.file.url || "";
				break;
			case "people":
				result[key] = value.people[0]?.name || "";
				break;

			default:
				// TODO: 노션에 있는 타입 다 정의한 후 여기서 throw 지원하지 않는 타입
				break;
		}
	}

	return result as R;
}
