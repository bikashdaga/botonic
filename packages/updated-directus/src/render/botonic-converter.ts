import * as cms from '../cms'
import { ButtonStyle } from '../cms'

export class RenderOptions {
  followUpDelaySeconds = 3
  defaultButtonsStyle?: ButtonStyle = ButtonStyle.BUTTON
}

export interface BotonicMsg {
  type: 'text' | 'image' | 'carousel'
  delay?: number
  data: any
  buttons?: any[]
}

export class BotonicMsgConverter {
  readonly options: RenderOptions

  constructor(options: Partial<RenderOptions> = {}) {
    this.options = { ...new RenderOptions(), ...options }
  }

  convert(content: cms.Content): BotonicMsg[] {
    if (content instanceof cms.Text) {
      return this.text(content)
    }
    if (content instanceof cms.Image) {
      return this.image(content)
    }
    if (content instanceof cms.Carousel) {
      return this.carousel(content)
    }
    throw new Error('Unsupported content type')
  }

  text(text: cms.Text, delayS = 0): BotonicMsg[] {
    const buttonsStyle = text.buttonsStyle || this.options.defaultButtonsStyle
    const buttons = this.convertButtons(text.buttons, buttonsStyle!)
    const msg: any = {
      type: 'text',
      delay: delayS,
      data: { text: text.text },
    }
    if (buttonsStyle === ButtonStyle.QUICK_REPLY) {
      msg['replies'] = buttons
    } else {
      msg['buttons'] = buttons
    }
    return this.appendFollowUp(msg, text)
  }

  private convertButtons(cmsButtons: cms.Button[], style: ButtonStyle): any[] {
    return cmsButtons.map(cmsButton => {
      const msgButton = {
        payload: cmsButton.callback.payload,
        url: cmsButton.callback.url,
      } as any
      if (style === ButtonStyle.BUTTON) {
        msgButton['title'] = cmsButton.text
      } else {
        msgButton['text'] = cmsButton.text
      }
      return msgButton
    })
  }

  image(img: cms.Image, delayS = 0): BotonicMsg[] {
    const msgs: BotonicMsg[] = []
    const msg: BotonicMsg = {
      type: 'image',
      delay: delayS,
      data: {
        image: img.imgUrl,
      },
    }
    msgs.push(msg)
    return msgs
  }

  carousel(carousel: cms.Carousel, delayS = 0): BotonicMsg[] {
    const msgs: BotonicMsg[] = []
    const msg: BotonicMsg = {
      type: 'carousel',
      delay: delayS,
      data: {
        elements: carousel.elements.map(e => this.element(e)),
      },
    }
    msgs.push(msg)
    return msgs
  }

  private element(cmsElement: cms.Element): any {
    return {
      img: cmsElement.imgUrl,
      title: cmsElement.title,
      subtitle: cmsElement.subtitle,
      buttons: this.convertButtons(cmsElement.buttons, ButtonStyle.BUTTON),
    }
  }

  private appendFollowUp(
    contentMsgs: BotonicMsg[],
    content: cms.Content
  ): BotonicMsg[] {
    if (content.common.followUp) {
      const followUp = this.followUp(content.common.followUp)
      const followUps = Array.isArray(followUp) ? followUp : [followUp]
      if (Array.isArray(contentMsgs)) {
        contentMsgs.push(...followUps)
      } else {
        contentMsgs = [contentMsgs, ...followUps]
      }
      return contentMsgs
    }
    return contentMsgs
  }

  private followUp(followUp: cms.Content): BotonicMsg[] {
    if (followUp instanceof cms.Text) {
      return this.text(followUp, this.options.followUpDelaySeconds)
    } else if (followUp instanceof cms.Image) {
      return this.image(followUp)
    } else if (followUp instanceof cms.Carousel) {
      return this.carousel(followUp)
    } else {
      throw new Error(`Unexpected followUp type: ${typeof followUp}`)
    }
  }
}