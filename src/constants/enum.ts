import z from "zod";

import {
  approvalModeEnum,
  eventCategoryEnum,
  eventStatusEnum,
  eventTypeEnum,
  experienceLevelEnum,
  participantCategoryEnum,
  participantStatusEnum,
  registrationMethodEnum,
  registrationStatusEnum,
} from "@/infra/database/enums";

export const PARTICIPANT_STATUS_ENUM = z.enum(
  participantStatusEnum.enumValues
).enum;

export const PARTICIPANT_CATEGORY_ENUM = z.enum(
  participantCategoryEnum.enumValues
).enum;

export const EXPERIENCE_LEVEL_ENUM = z.enum(
  experienceLevelEnum.enumValues
).enum;

export const EVENT_TYPE_ENUM = z.enum(eventTypeEnum.enumValues).enum;

export const EVENT_CATEGORY_ENUM = z.enum(eventCategoryEnum.enumValues).enum;

export const EVENT_STATUS_ENUM = z.enum(eventStatusEnum.enumValues).enum;

export const APPROVAL_MODE_ENUM = z.enum(approvalModeEnum.enumValues).enum;

export const REGISTRATION_METHOD_ENUM = z.enum(
  registrationMethodEnum.enumValues
).enum;

export const REGISTRATION_STATUS_ENUM = z.enum(
  registrationStatusEnum.enumValues
).enum;
