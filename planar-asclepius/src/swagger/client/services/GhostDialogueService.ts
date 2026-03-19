/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GhostDialogueService {
    /**
     * Get skeleton of the dialogue in ghost format
     * @param dialogueId Id of the dlg file
     * @returns string Skeleton of the dialogue in ghost format
     * @throws ApiError
     */
    public static getGhostDialogueSkeleton(
        dialogueId: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ghost/dialogue/{dialogueId}/skeleton',
            path: {
                'dialogueId': dialogueId,
            },
            errors: {
                400: `File not found or invalid request`,
            },
        });
    }
    /**
     * Get translation of the dialogue in ghost format
     * @param dialogueId Id of the dlg file
     * @param language
     * @returns string Translation of the dialogue in ghost format
     * @throws ApiError
     */
    public static getGhostDialogueTranslation(
        dialogueId: string,
        language: 'ru_RU' | 'en_US',
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ghost/dialogue/{dialogueId}/translation/{language}',
            path: {
                'dialogueId': dialogueId,
                'language': language,
            },
            errors: {
                400: `File not found or invalid request`,
            },
        });
    }
}
