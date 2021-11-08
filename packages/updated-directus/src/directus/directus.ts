import { Stream } from 'stream'

import * as cms from '../cms'
import {
  AssetInfo,
  Button,
  Carousel,
  Content,
  ContentId,
  Image,
  Text,
  Url,
} from '../cms'
import { DirectusOptions } from '../plugin'
import { ButtonDelivery } from './contents/button'
import { CarouselDelivery } from './contents/carousel'
import { ImageDelivery } from './contents/image'
import { TextDelivery } from './contents/text'
import { UrlDelivery } from './contents/url'
import { DirectusClient } from './delivery/directus-client'
import { ContentsDelivery } from './manage/contents'
import {
  CarouselFields,
  ElementFields,
  TextFields,
} from './manage/directus-contents'
import { LocalesDelivery } from './manage/locales'
import { KeywordsDelivery } from './search/keywords'

export class Directus implements cms.CMS {
  private readonly _text: TextDelivery
  private readonly _button: ButtonDelivery
  private readonly _url: UrlDelivery
  private readonly _carousel: CarouselDelivery
  private readonly _image: ImageDelivery
  private readonly _keywords: KeywordsDelivery
  private readonly _contents: ContentsDelivery
  private readonly _locales: LocalesDelivery

  constructor(opt: DirectusOptions) {
    const client = new DirectusClient(opt)
    this._button = new ButtonDelivery(client)
    this._url = new UrlDelivery(client)
    this._image = new ImageDelivery(client)
    this._carousel = new CarouselDelivery(client, this._button)
    this._text = new TextDelivery(
      client,
      this._button,
      this._image,
      this._carousel
    )
    this._keywords = new KeywordsDelivery(client)
    const deliveries = {
      [cms.ContentType.TEXT]: this._text,
      [cms.ContentType.IMAGE]: this._image,
      [cms.ContentType.CAROUSEL]: this._carousel,
      [cms.ContentType.URL]: this._url,
    }
    this._contents = new ContentsDelivery(client, deliveries)
    this._locales = new LocalesDelivery(client)
  }

  async text(id: string, context: cms.SupportedLocales): Promise<Text> {
    return this._text.text(id, context)
  }
  async button(id: string, context: cms.SupportedLocales): Promise<Button> {
    return this._button.button(id, context)
  }
  async image(id: string, context: cms.SupportedLocales): Promise<Image> {
    return this._image.image(id, context)
  }
  async url(id: string, context: cms.SupportedLocales): Promise<Url> {
    return this._url.url(id, context)
  }

  async carousel(id: string, context: cms.SupportedLocales): Promise<Carousel> {
    return this._carousel.carousel(id, context)
  }

  async contentsWithKeywords(input: string): Promise<string[]> {
    return this._keywords.contentsWithKeywords(input)
  }
  async topContents(
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Promise<Content[]> {
    return this._contents.topContents(contentType, context)
  }
  async deleteContent(contentId: ContentId): Promise<void> {
    await this._contents.deleteContent(contentId)
  }

  async createContent(contentId: ContentId): Promise<void> {
    await this._contents.createContent(contentId)
  }

  async updateTextFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateTextFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateButtonFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateButtonFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateImageFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateImageFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateCarouselFields(
    context: cms.SupportedLocales,
    id: string,
    fields: CarouselFields,
    applyToAllLocales: boolean = true
  ) {
    await this._contents.updateCarouselFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateElementFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ElementFields,
    applyToAllLocales: boolean = true
  ) {
    await this._contents.updateElementFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async createAsset(
    context: cms.SupportedLocales,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<void> {
    await this._contents.createAsset(context, file, info)
  }

  async getLocales(): Promise<cms.SupportedLocales[]> {
    return await this._locales.getLocales()
  }

  async removeLocale(locale: cms.SupportedLocales): Promise<void> {
    await this._locales.removeLocale(locale)
  }
}
