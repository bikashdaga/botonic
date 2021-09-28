import * as cms from '../../cms'
import { Directus, PartialItem } from '@directus/sdk/dist'
import {
  getContentFields,
  getKeywordsFilter,
  getLocaleFilter,
  hasFollowUp,
} from './delivery-utils'
import { DirectusOptions } from '../../plugin'


export class DirectusClient {
  clientParams: DirectusOptions
  private client: Directus<any>
  constructor(opt: DirectusOptions) {
    this.clientParams = opt
    this.client = new Directus(this.clientParams.credentials.apiEndPoint)
  }

  async getEntry(
    id: string,
    contentType: cms.ContentType,
    context: cms.SupportedLocales
  ): Promise<PartialItem<any>> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const entry = await this.client.items(contentType).readOne(id, {
        fields: getContentFields(contentType),
        deep: getLocaleFilter(context, contentType),
      })
      if (hasFollowUp(entry)) {
        Object.assign(entry, await this.getFollowup(entry!, context))
      }
      return entry!
    } catch (e) {
      throw new Error(
        `Error getting content with id ${id} of content type ${contentType} and locale ${context}, error: ${e}`
      )
    }
  }

  async contentsWithKeywords(input: string): Promise<string[]> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const entry = await this.client
        .items(cms.MessageContentType.TEXT)
        .readMany(getKeywordsFilter(input))
      const ids =
        (entry.data &&
          entry.data.map((searchResult: any) => {
            return searchResult.id
          })) ??
        []
      return ids
    } catch (e) {
      throw new Error(
        `Error getting keywords from input: ${input}, error: ${e}`
      )
    }
  }

  async topContents(
    contentType: cms.ContentType,
    context: cms.SupportedLocales
  ): Promise<PartialItem<any>[]> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)

      const entriesIds = await this.client
        .items(contentType)
        .readMany({ fields: ['id'] })

      let entries: PartialItem<any>[] | undefined = []

      for (let i = 0; i < entriesIds.data!.length; i++) {
        const entry = await this.getEntry(
          entriesIds.data![i].id,
          contentType,
          context
        )
        entries.push(entry)
      }
      return entries ?? []
    } catch (e) {
      throw new Error(
        `Error getting the contents of type ${contentType}, error: ${e}`
      )
    }
  }

  async deleteContent(
    context: cms.SupportedLocales,
    contentType: cms.ContentType,
    id: string
  ) {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      await this.client.items(contentType).deleteOne(id)
    } catch (e) {
      throw new Error(
        `Error deleting content with id: ${id} of content type ${contentType}, error: ${e}`
      )
    }
  }

  async createContent(
    context: cms.SupportedLocales,
    contentType: cms.ContentType,
    id: string
  ) {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      const name = 'random-' + Math.random().toString(36).substring(2)
      await this.client.items(contentType).createOne({ id, name })
    } catch (e) {
      throw new Error(
        `Error creating content with id: ${id} of content type ${contentType}, error: ${e}`
      )
    }
  }

  async updateTextFields(
    context: cms.SupportedLocales,
    id: string,
    fields: Object
  ): Promise<void> {
    try {
      await this.client.auth.static(this.clientParams.credentials.token)
      await this.client.items(cms.MessageContentType.TEXT).updateOne(id, fields)
    } catch (e) {
      throw new Error(
        `Error updating content with id: ${id} of content type ${cms.MessageContentType.TEXT}, error: ${e}`
      )
    }
  }

  private async getFollowup(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ) {
    const followupId = entry.followup[0].item.id
    const contentType = !!entry.followup[0].item.image
      ? cms.MessageContentType.IMAGE
      : cms.MessageContentType.TEXT
    return {
      ...entry,
      followup: await this.getEntry(followupId, contentType, context),
    }
  }
}