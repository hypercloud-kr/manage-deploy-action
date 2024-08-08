import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export type DatabaseStatus = "Public" | "Private";

export type DatabaseProperties = Extract<
  QueryDatabaseResponse["results"][number],
  { properties: Record<string, unknown> }
>;

type PropertyValueMap = DatabaseProperties["properties"];

type PropertyValue = PropertyValueMap[string];

type PropertyValueType = PropertyValue["type"];

type ExtractedPropertyValue<TType extends PropertyValueType> = Extract<
  PropertyValue,
  { type: TType }
>;

export type PropertyValueTitle = ExtractedPropertyValue<"title">;
export type PropertyValueRichText = ExtractedPropertyValue<"rich_text">;
export type PropertyValueSelect = ExtractedPropertyValue<"select">;
export type PropertyValueMultiSelect = ExtractedPropertyValue<"multi_select">;
export type PropertyValueNumber = ExtractedPropertyValue<"number">;
export type PropertyValueDate = ExtractedPropertyValue<"date">;
export type PropertyValueFormula = ExtractedPropertyValue<"formula">;
export type PropertyValueRelation = ExtractedPropertyValue<"relation">;
export type PropertyValueRollup = ExtractedPropertyValue<"rollup">;
export type PropertyValuePeople = ExtractedPropertyValue<"people">;
export type PropertyValueFiles = ExtractedPropertyValue<"files">;
export type PropertyValueCheckbox = ExtractedPropertyValue<"checkbox">;
export type PropertyValueUrl = ExtractedPropertyValue<"url">;
export type PropertyValueEmail = ExtractedPropertyValue<"email">;
export type PropertyValuePhoneNumber = ExtractedPropertyValue<"phone_number">;
export type PropertyValueCreatedTime = ExtractedPropertyValue<"created_time">;
export type PropertyValueCreatedBy = ExtractedPropertyValue<"created_by">;
export type PropertyValueLastEditedTime =
  ExtractedPropertyValue<"last_edited_time">;
export type PropertyValueLastEditedBy =
  ExtractedPropertyValue<"last_edited_by">;
