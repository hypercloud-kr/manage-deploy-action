import {notion, transformDBRow} from "./notion";
import {DatabaseProperties, PropertyValueDate, PropertyValueSelect, PropertyValueTitle} from "./types/notion";
import dayjs from "dayjs";
import {getInput} from "@actions/core";


type ProjectItem = DatabaseProperties & {
	properties: {
		version: PropertyValueTitle;
		deploy_date: PropertyValueDate;
		author: any;
		service: PropertyValueSelect;
		status: PropertyValueSelect;
	};
};

type IProject = {
	version: string;
	deploy_date: string;
	service: string;
	status: "서비스중" | "X";
}

async function run() {
	const PROJECT_KEY = getInput('project-key', { required: true });
	const NOTION_DATABASE_ID = getInput('notion-database-id', { required: true });
	const VERSION = getInput('version', { required: true });

	const today = dayjs().format('YYYY-MM-DD');
	// 기존 배포 비활성화 처리
	const res = await notion.databases
		.query({
			database_id: NOTION_DATABASE_ID!,
			filter: {
				and: [
					{
						property: "status",
						select: {
							equals: "서비스중",
						},
					},
					{
						property: "service",
						select: {
							equals: PROJECT_KEY,
						},
					},
				],
			},
		})
	const prevProjects = res.results.map((item) => ({
		...transformDBRow<ProjectItem, IProject>(item as any),
		id: item.id
	}));
	const updates =prevProjects.map((project) => {
		return notion.pages.update({
			page_id: project.id,
			properties: {
				status: {
					select: {
						name: "X"
					}
				},
				deploy_date: {
					date: {
						start: project.deploy_date,
						end: today
					}
				}
			}
		})
	});
	await Promise.all(updates);

	// 신규 배포 버전 노출
	const createResponse = await notion.pages.create({
		parent: { database_id: NOTION_DATABASE_ID },
		properties: {
			version: {
				title: [
					{
						type: "text",
						text: {
							content: VERSION
						}
					}
				]
			},
			deploy_date: {
				date: {
					start: today,
					end: '2099-12-31'
				}
			},
			status: {
				select: {
					name: "서비스중"
				}
			},
			service: {
				select: {
					name: PROJECT_KEY
				}
			}
		}
	});
}
run();