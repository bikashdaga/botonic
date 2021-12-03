import { ContentId } from '../cms'
import { Stream } from 'stream'

import {
  ButtonFields,
  CarouselFields,
  ElementFields,
  HandoffFields,
  ImageFields,
  PayloadFields,
  QueueFields,
  TextFields,
  UrlFields,
} from '../directus/manage/directus-contents'
import {
  Button,
  Carousel,
  Content,
  Image,
  Payload,
  Queue,
  Text,
  Url,
  ScheduleContent,
  Handoff,
} from './contents'
import { AssetInfo } from './contents'

export enum MessageContentType {
  TEXT = 'text',
  IMAGE = 'image',
  CAROUSEL = 'carousel',
  HANDOFF = 'handoff',
}

export enum NonMessageContentType {
  QUEUE = 'queue',
  SCHEDULE = 'schedule',
  URL = 'url',
  PAYLOAD = 'payload',
}

export enum SubContentType {
  BUTTON = 'button',
  ELEMENT = 'element',
}

export enum SupportedLocales {
  AFRIKAANS = 'af-ZA',
  ARABIC = 'ar-SA',
  BENGALI = 'bn-IN',
  BRETON = 'br-FR',
  BULGARIAN = 'bg-BG',
  CATALAN = 'ca-ES',
  CHINESE = 'zh-CN',
  CZECH = 'cs-CZ',
  DANISH = 'da-DK',
  DUTCH = 'nl-NL',
  ENGLISH = 'en-US',
  ESTONIAN = 'et-EE',
  FINNISH = 'fi-FI',
  FRENCH = 'fr-FR',
  GEORGIAN = 'ka-GE',
  GERMAN = 'de-DE',
  GREEK = 'el-GR',
  HEBREW = 'he-IL',
  HINDI = 'hi-IN',
  HUNGARIAN = 'hu-HU',
  ICELANDIC = 'is-IS',
  INDONESIAN = 'id-ID',
  ITALIAN = 'it-IT',
  JAPANESE = 'ja-JP',
  KOREAN = 'ko-KR',
  LITHUANIAN = 'lt-LT',
  MALAY = 'ms-MY',
  NORWEGIAN = 'no-NO',
  FARCI = 'fa-IR',
  POLISH = 'pl-PL',
  PORTUGUESE = 'pt-PT',
  ROMANIAN = 'ro-RO',
  RUSSIAN = 'ru-RU',
  SERBIAN = 'sr-SP',
  SINHALA = 'si-LK',
  SLOVAK = 'sk-SK',
  SLOVENIAN = 'sl-SI',
  SPANISH = 'es-ES',
  SWEDISH = 'sv-SE',
  TAIWANESE_MANDARIN = 'zh-TW',
  THAI = 'th-TH',
  TURKISH = 'tr-TR',
  UKRAINIAN = 'uk-UA',
  VIETNAMESE = 'vi-VN',
}

export type TopContentType = MessageContentType | NonMessageContentType

export const TopContentType = {
  ...MessageContentType,
  ...NonMessageContentType,
}

export type ContentType = TopContentType | SubContentType

export const ContentType = { ...TopContentType, ...SubContentType }

export const ContentTypes = [
  ContentType.URL,
  ContentType.PAYLOAD,
  ContentType.TEXT,
  ContentType.CAROUSEL,
  ContentType.QUEUE,
  ContentType.HANDOFF,
  ContentType.IMAGE,
  ContentType.SCHEDULE,
  ContentType.ELEMENT,
  ContentType.BUTTON,
]

export type LocaleToBeAddedType = {
  locale: SupportedLocales
  copyFrom?: SupportedLocales
}

export interface CMS {
  button(id: string, context: SupportedLocales): Promise<Button>

  image(id: string, context: SupportedLocales): Promise<Image>

  text(id: string, context: SupportedLocales): Promise<Text>

  url(id: string, context: SupportedLocales): Promise<Url>

  carousel(id: string, context: SupportedLocales): Promise<Carousel>

  payload(id: string, context: SupportedLocales): Promise<Payload>

  schedule(id: string, context: SupportedLocales): Promise<ScheduleContent>

  queue(id: string, context: SupportedLocales): Promise<Queue>

  handoff(id: string, context: SupportedLocales): Promise<Handoff>

  contentsWithKeywords(input: string): Promise<string[]>

  topContents(
    contentType: ContentType,
    context: SupportedLocales
  ): Promise<Content[]>

  deleteContent(contentId: ContentId): Promise<void>

  createContent(contentId: ContentId): Promise<void>

  updateUrlFields(
    context: SupportedLocales,
    id: string,
    fields: UrlFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updatePayloadFields(
    context: SupportedLocales,
    id: string,
    fields: PayloadFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updateQueueFields(
    context: SupportedLocales,
    id: string,
    fields: QueueFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updateTextFields(
    context: SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updateButtonFields(
    context: SupportedLocales,
    id: string,
    fields: ButtonFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updateImageFields(
    context: SupportedLocales,
    id: string,
    fields: ImageFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updateCarouselFields(
    context: SupportedLocales,
    id: string,
    fields: CarouselFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updateElementFields(
    context: SupportedLocales,
    id: string,
    fields: ElementFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  updateHandoffFields(
    context: SupportedLocales,
    id: string,
    fields: HandoffFields,
    applyToAllLocales?: boolean
  ): Promise<void>

  createAsset(
    file: string | ArrayBuffer | Stream,
    info?: AssetInfo
  ): Promise<void>

  getLocales(): Promise<SupportedLocales[]>

  removeLocales(locales: SupportedLocales[]): Promise<void>

  addLocales(localesToBeAdded: LocaleToBeAddedType[]): Promise<void>
}