'use client'

import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'antd'

import {
  JOURNAL_TITLE_PDF_DEFAULT_DATA,
  type JournalTitlePdfData,
  JournalTitlePdfDocument,
} from '@/modules/journal/journalTitlePdfDocument'

import styles from './JournalTitlePdfModal.module.scss'

import { pdf, PDFViewer } from '@react-pdf/renderer'

const MODAL_TITLE = 'Титульный лист журнала авторского надзора'
const BTN_DOWNLOAD = 'Скачать PDF'
const DOWNLOAD_FILENAME = 'zhurnal-avtorskogo-nadzora-titul.pdf'

type JournalTitlePdfModalProps = {
  readonly data?: JournalTitlePdfData
  readonly isSigned?: boolean
  readonly open: boolean
  readonly onClose: () => void
}

const JournalTitlePdfModal = ({
  data = JOURNAL_TITLE_PDF_DEFAULT_DATA,
  isSigned = false,
  open,
  onClose,
}: JournalTitlePdfModalProps) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      const instance = pdf(<JournalTitlePdfDocument data={data} isSigned={isSigned} />)
      const blob = await instance.toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = DOWNLOAD_FILENAME
      a.rel = 'noopener'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }, [data, isSigned])

  return (
    <Modal
      centered
      footer={null}
      open={open}
      title={MODAL_TITLE}
      width={880}
      onCancel={onClose}
    >
      <div className={styles.toolbar}>
        <Button loading={downloading} type="primary" onClick={handleDownload}>
          {BTN_DOWNLOAD}
        </Button>
      </div>
      <div className={styles.viewerWrap}>
        <PDFViewer className={styles.viewer} showToolbar width="100%">
          <JournalTitlePdfDocument data={data} isSigned={isSigned} />
        </PDFViewer>
      </div>
    </Modal>
  )
}

export default JournalTitlePdfModal
