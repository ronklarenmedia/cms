import type { Block } from 'payload'

// Hero block — gebaseerd op starter-templates.com/kitkit/k1780 ("Blocks" hero)
// Structuur: rating/avatar-badge -> koptekst -> subtekst -> CTA-knop
//            -> foto-galerij (kolommen, elk 'tall' of 'half') -> onderbalk met stats
export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero blokken',
  },
  interfaceName: 'HeroBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Inhoud',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              label: 'Koptekst',
              defaultValue: 'Quis autem veleum iure repreh enderit.',
            },
            {
              name: 'subheading',
              type: 'textarea',
              label: 'Subtekst',
              defaultValue:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit sed fegiat tellus anean viverra mauris congue sapien vestibulum.',
            },
            {
              type: 'collapsible',
              label: 'Social proof badge',
              fields: [
                {
                  name: 'showSocialProof',
                  type: 'checkbox',
                  label: 'Tonen',
                  defaultValue: true,
                },
                {
                  name: 'avatars',
                  type: 'array',
                  label: 'Avatars',
                  maxRows: 5,
                  admin: { condition: (_, siblingData) => siblingData?.showSocialProof },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Rating (0–5)',
                  min: 0,
                  max: 5,
                  defaultValue: 4.5,
                  admin: {
                    step: 0.1,
                    condition: (_, siblingData) => siblingData?.showSocialProof,
                  },
                },
                {
                  name: 'trustText',
                  type: 'text',
                  label: 'Vertrouwenstekst',
                  defaultValue: 'Trusted by 10k+ customers',
                  admin: { condition: (_, siblingData) => siblingData?.showSocialProof },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaLabel',
                  type: 'text',
                  label: 'Knoptekst',
                  defaultValue: 'Get Started Now',
                  admin: { width: '50%' },
                },
                {
                  name: 'ctaLink',
                  type: 'text',
                  label: 'Knoplink',
                  defaultValue: '#',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Galerij',
          fields: [
            {
              name: 'images',
              type: 'array',
              label: 'Kolommen',
              labels: { singular: 'Kolom', plural: 'Kolommen' },
              minRows: 1,
              maxRows: 6,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'layout',
                      type: 'select',
                      label: 'Type',
                      defaultValue: 'tall',
                      options: [
                        { label: 'Eén hoge foto', value: 'tall' },
                        { label: 'Twee gestapelde foto’s', value: 'half' },
                      ],
                      admin: { width: '30%' },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Foto',
                      required: true,
                      admin: {
                        width: '35%',
                        condition: (_, siblingData) => siblingData?.layout === 'tall',
                      },
                    },
                    {
                      name: 'imageTop',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Foto boven',
                      admin: {
                        width: '35%',
                        condition: (_, siblingData) => siblingData?.layout === 'half',
                      },
                    },
                    {
                      name: 'imageBottom',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Foto onder',
                      admin: {
                        width: '35%',
                        condition: (_, siblingData) => siblingData?.layout === 'half',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Onderbalk',
          fields: [
            {
              name: 'showBottomBar',
              type: 'checkbox',
              label: 'Onderbalk tonen',
              defaultValue: true,
            },
            {
              name: 'bottomHeading',
              type: 'text',
              label: 'Tekst links',
              defaultValue: 'Faster loading speed for all clients',
              admin: { condition: (_, siblingData) => siblingData?.showBottomBar },
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Statistieken',
              labels: { singular: 'Statistiek', plural: 'Statistieken' },
              maxRows: 4,
              admin: { condition: (_, siblingData) => siblingData?.showBottomBar },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Waarde',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      required: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
              defaultValue: [
                { value: '865+', label: 'Projects Done' },
                { value: '98%', label: 'Satisfied Clients' },
                { value: '10x', label: 'More Traffic' },
              ],
            },
          ],
        },
        {
          label: 'Instellingen',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Achtergrondkleur',
              defaultValue: '#f7f7f7',
              admin: {
                description: 'Hex-waarde, bv. #f7f7f7. Overschrijft het site-thema voor dit blok.',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default Hero
