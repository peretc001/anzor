'use client'

import React from 'react'

import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

export type JournalTitlePdfData = {
  readonly constructionAddress: string
  readonly developer: string
  readonly journalEnded: string
  readonly journalNumber: string
  readonly journalStarted: string
  readonly objectName: string
  readonly supervisionPerson: string
}

export const JOURNAL_TITLE_PDF_DEFAULT_DATA: JournalTitlePdfData = {
  constructionAddress: 'Краснодар, ул. Беличенок 88, 15эт, кв 77',
  developer: 'ООО «Строительная компания»',
  journalEnded: '15.03.2026',
  journalNumber: '____',
  journalStarted: '15.03.2026',
  objectName: 'Квартира ЖК Самолет',
  supervisionPerson: 'Дизайнер Клименко Марина Игоревна',
}

Font.register({
  family: 'Roboto',
  fonts: [
    {
      fontWeight: 400,
      src: '/fonts/Roboto-400.ttf',
    },
    {
      fontWeight: 700,
      src: '/fonts/Roboto-700.ttf',
    },
  ],
})

const PDF_DOC_TITLE = 'Журнал авторского надзора — титульный лист'
const PDF_TITLE_SUB = 'авторского надзора за строительством'
const PDF_LABEL_OBJECT = 'Наименование объекта капитального строительства'
const PDF_LABEL_ADDRESS = 'Адрес строительства'
const PDF_LABEL_DEVELOPER = 'Застройщик (технический заказчик)'
const PDF_HINT_DEVELOPER = '(наименование, адрес)'
const PDF_LABEL_SUPERVISION = 'Лицо, осуществляющее авторский надзор'
const PDF_HINT_SUPERVISION =
  '(наименование организации, Ф.И.О. индивидуального предпринимателя, адрес)'
const PDF_LABEL_SIGN_SUPERVISION = 'Лицо, осуществляющее авторский надзор'
const PDF_LABEL_SIGN_DEVELOPER = 'Руководитель застройщика (технического заказчика)'
const PDF_STAMP_PLACEHOLDER = 'МП'
const PDF_SIGN_HINT = '(подпись)'
const PDF_JOURNAL_NUMBER_FALLBACK = '____'
const PDF_SIGNATURE_IMAGE_SRC = '/sign.jpg'

const styles = StyleSheet.create({
  block: {
    marginBottom: 18,
  },
  dateCol: {
    maxWidth: '48%',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 36,
    marginTop: 8,
  },
  hint: {
    color: '#333',
    fontSize: 8,
    marginBottom: 6,
    marginTop: -4,
  },
  label: {
    fontSize: 10,
    marginBottom: 6,
  },
  mp: {
    fontSize: 10,
    width: 80,
  },
  page: {
    color: '#111',
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 1.45,
    paddingBottom: 48,
    paddingHorizontal: 44,
    paddingTop: 48,
  },
  signBlock: {
    marginBottom: 28,
  },
  signHint: {
    fontSize: 8,
    marginTop: 2,
    textAlign: 'center',
  },
  signLine: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    minHeight: 18,
  },
  signLineWrap: {
    flex: 1,
  },
  signRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 24,
  },
  signTitle: {
    fontSize: 10,
    marginBottom: 10,
  },
  signatureImage: {
    objectFit: 'contain',
    width: '100%',
  },
  signatureImageWrap: {
    marginTop: 12,
    width: '100%',
  },
  titleCenter: {
    marginBottom: 4,
    textAlign: 'center',
  },
  titleMain: {
    fontSize: 12,
    fontWeight: 700,
  },
  titleSub: {
    fontSize: 11,
    fontWeight: 400,
    marginBottom: 28,
    marginTop: 4,
  },
  valueLine: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginBottom: 8,
    minHeight: 14,
    paddingBottom: 3,
  },
  valueText: {
    fontSize: 10,
  },
})

type JournalTitlePdfDocumentProps = {
  readonly data?: JournalTitlePdfData
  readonly isSigned?: boolean
}

export const JournalTitlePdfDocument = ({
  data = JOURNAL_TITLE_PDF_DEFAULT_DATA,
  isSigned = false,
}: JournalTitlePdfDocumentProps) => {
  const num = data.journalNumber.trim() || PDF_JOURNAL_NUMBER_FALLBACK

  return (
    <Document language="ru" title={PDF_DOC_TITLE}>
      <Page style={styles.page} size="A4">
        <View style={styles.titleCenter}>
          <Text style={styles.titleMain}>{`ЖУРНАЛ № ${num}`}</Text>
        </View>
        <View style={styles.titleCenter}>
          <Text style={styles.titleSub}>{PDF_TITLE_SUB}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{PDF_LABEL_OBJECT}</Text>
          <View style={styles.valueLine}>
            <Text style={styles.valueText}>{data.objectName}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{PDF_LABEL_ADDRESS}</Text>
          <View style={styles.valueLine}>
            <Text style={styles.valueText}>{data.constructionAddress}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{PDF_LABEL_DEVELOPER}</Text>
          <View style={styles.valueLine}>
            <Text style={styles.valueText}>{data.developer}</Text>
          </View>
          <Text style={styles.hint}>{PDF_HINT_DEVELOPER}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{PDF_LABEL_SUPERVISION}</Text>
          <View style={styles.valueLine}>
            <Text style={styles.valueText}>{data.supervisionPerson}</Text>
          </View>
          <Text style={styles.hint}>{PDF_HINT_SUPERVISION}</Text>
        </View>

        <View style={styles.datesRow}>
          <View style={styles.dateCol}>
            <Text>{`Журнал начат ${data.journalStarted} (дата)`}</Text>
          </View>
          <View style={styles.dateCol}>
            <Text style={{ textAlign: 'right' }}>{`Журнал окончен ${data.journalEnded} (дата)`}</Text>
          </View>
        </View>

        <View style={styles.signBlock}>
          <Text style={styles.signTitle}>{PDF_LABEL_SIGN_SUPERVISION}</Text>
          <View style={styles.signRow}>
            <Text style={styles.mp}>{PDF_STAMP_PLACEHOLDER}</Text>
            <View style={styles.signLineWrap}>
              <View style={styles.signLine} />
              <Text style={styles.signHint}>{PDF_SIGN_HINT}</Text>
            </View>
          </View>
        </View>

        <View style={styles.signBlock}>
          <Text style={styles.signTitle}>{PDF_LABEL_SIGN_DEVELOPER}</Text>
          <View style={styles.signRow}>
            <Text style={styles.mp}>{PDF_STAMP_PLACEHOLDER}</Text>
            <View style={styles.signLineWrap}>
              <View style={styles.signLine} />
              <Text style={styles.signHint}>{PDF_SIGN_HINT}</Text>
            </View>
          </View>
        </View>

        {isSigned ? (
          <View style={styles.signatureImageWrap}>
            <Image style={styles.signatureImage} src={PDF_SIGNATURE_IMAGE_SRC} />
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
