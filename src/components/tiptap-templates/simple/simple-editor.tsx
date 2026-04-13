'use client'

import React, { FC, useEffect, useRef, useState } from 'react'

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon'
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon'
import { LinkIcon } from '@/components/tiptap-icons/link-icon'
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent
} from '@/components/tiptap-ui/color-highlight-popover'
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { LinkButton, LinkContent, LinkPopover } from '@/components/tiptap-ui/link-popover'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
// --- UI Primitives ---
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'

import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
// --- Styles ---
import '@/components/tiptap-templates/simple/simple-editor.scss'

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
