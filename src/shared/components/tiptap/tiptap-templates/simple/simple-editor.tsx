'use client'

import React, { FC, useEffect, useRef, useState } from 'react'

// --- Icons ---
import { ArrowLeftIcon } from '@/shared/components/tiptap/tiptap-icons/arrow-left-icon'
import { HighlighterIcon } from '@/shared/components/tiptap/tiptap-icons/highlighter-icon'
import { LinkIcon } from '@/shared/components/tiptap/tiptap-icons/link-icon'
import { HorizontalRule } from '@/shared/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
import { BlockquoteButton } from '@/shared/components/tiptap/tiptap-ui/blockquote-button'
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent
} from '@/shared/components/tiptap/tiptap-ui/color-highlight-popover'
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/shared/components/tiptap/tiptap-ui/heading-dropdown-menu'
import { LinkButton, LinkContent, LinkPopover } from '@/shared/components/tiptap/tiptap-ui/link-popover'
import { ListDropdownMenu } from '@/shared/components/tiptap/tiptap-ui/list-dropdown-menu'
import { MarkButton } from '@/shared/components/tiptap/tiptap-ui/mark-button'
import { TextAlignButton } from '@/shared/components/tiptap/tiptap-ui/text-align-button'
import { UndoRedoButton } from '@/shared/components/tiptap/tiptap-ui/undo-redo-button'
// --- UI Primitives ---
import { Button } from '@/shared/components/tiptap/tiptap-ui-primitive/button'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/shared/components/tiptap/tiptap-ui-primitive/toolbar'

import '@/shared/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/shared/components/tiptap/tiptap-node/code-block-node/code-block-node.scss'
import '@/shared/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/shared/components/tiptap/tiptap-node/list-node/list-node.scss'
import '@/shared/components/tiptap/tiptap-node/image-node/image-node.scss'
import '@/shared/components/tiptap/tiptap-node/heading-node/heading-node.scss'
import '@/shared/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss'
// --- Styles ---
import '@/shared/components/tiptap/tiptap-templates/simple/simple-editor.scss'

// --- Hooks ---
import { useIsBreakpoint } from '@/hooks/use-is-breakpoint'
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
// --- Components ---
import { CharacterCount } from '@tiptap/extensions'
import { Selection } from '@tiptap/extensions'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit'

const MainToolbarContent = ({
  isMobile,
  onHighlighterClick,
  onLinkClick
}: {
  readonly isMobile: boolean
  readonly onHighlighterClick: () => void
  readonly onLinkClick: () => void
}) => (
  <>
    <ToolbarGroup>
      <UndoRedoButton action="undo" />
      <UndoRedoButton action="redo" />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
      <ListDropdownMenu portal={isMobile} types={['bulletList', 'orderedList']} />
      <BlockquoteButton />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="strike" />
      <MarkButton type="code" />
      <MarkButton type="underline" />
      {!isMobile ? (
        <ColorHighlightPopover />
      ) : (
        <ColorHighlightPopoverButton onClick={onHighlighterClick} />
      )}
      {/*{!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}*/}
    </ToolbarGroup>

    {/*<ToolbarSeparator />*/}

    {/*<ToolbarGroup>*/}
    {/*  <TextAlignButton align="left" />*/}
    {/*  <TextAlignButton align="center" />*/}
    {/*  <TextAlignButton align="right" />*/}
    {/*  <TextAlignButton align="justify" />*/}
    {/*</ToolbarGroup>*/}
  </>
)

const MobileToolbarContent = ({
  type,
  onBack
}: {
  readonly type: 'highlighter' | 'link'
  readonly onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
)

interface IEditor {
  readonly defaultContent: React.ReactNode
  readonly limit?: number
  readonly onChange: (value: React.ReactNode) => void
}

const SimpleEditor: FC<IEditor> = ({ defaultContent, limit, onChange }) => {
  const isMobile = useIsBreakpoint()
  const [mobileView, setMobileView] = useState<'highlighter' | 'link' | 'main'>('main')
  const toolbarRef = useRef<HTMLDivElement>(null)

  const textLimit = limit || 2000

  const editor = useEditor({
    // @ts-ignore
    content: defaultContent,
    editorProps: {
      attributes: {
        'aria-label': 'Main content area, start typing to enter text.',
        autocapitalize: 'off',
        autocomplete: 'off',
        autocorrect: 'off',
        class: 'simple-editor'
      }
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          enableClickSelection: true,
          openOnClick: false
        }
      }),
      CharacterCount.configure({
        limit: textLimit
      }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Selection
    ],
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    }
  })

  useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main')
    }
  }, [isMobile, mobileView])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar ref={toolbarRef}>
          {mobileView === 'main' ? (
            <MainToolbarContent
              isMobile={isMobile}
              onHighlighterClick={() => setMobileView('highlighter')}
              onLinkClick={() => setMobileView('link')}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
              onBack={() => setMobileView('main')}
            />
          )}
        </Toolbar>

        <EditorContent className="simple-editor-content" editor={editor} role="presentation" />
      </EditorContext.Provider>
    </div>
  )
}

export default SimpleEditor
