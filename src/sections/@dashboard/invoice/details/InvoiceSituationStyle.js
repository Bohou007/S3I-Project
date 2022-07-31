import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  col12: { width: '100%' },
  mb8: { marginBottom: 10 },
  mb4: { marginBottom: 5 },
  mb40: { marginBottom: 30 },
  mb30: { marginBottom: 20 },
  textAligne: { textAlign: 'right', flexDirection: 'column', justifyContent: 'flex-end' },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  titleIn: { fontSize: 17 },
  titleEn: { fontSize: 13 },
  h3: { fontSize: 16, fontWeight: 700, color: '#229A16' },
  h4: { fontSize: 13, fontWeight: 700 },
  title2: { fontSize: 12, fontWeight: 'bold' },
  saufBlock: { marginTop: 10 },
  sauf: { fontWeight: 'bold' },
  labelColor: {
    height: 22,
    minWidth: 22,
    borderRadius: 8,
    cursor: 'default',
    padding: 6,
    color: '#229A16',
    backgroundColor: 'rgba(84, 214, 44, 0.16)',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  alignRight: { textAlign: 'right' },
  page: {
    padding: '40px 24px 56px 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    // textTransform: 'capitalize',
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8',
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  table1: {
    display: 'flex',
    width: '380px',
    marginTop: 10,
    marginBottom: 5,
    border: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    '& th': { backgroundColor: 'transparent' },
  },
  table1_0: {
    display: 'flex',
    width: '380px',
    marginBottom: 5,
    border: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    '& th': { backgroundColor: 'transparent' },
  },
  table2: {
    display: 'flex',
    width: '380px',
    marginBottom: 10,
    border: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    '& th': { backgroundColor: 'transparent' },
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 20,
    marginBottom: 25,
    minWidth: 100,
    // border: 1,
    // borderStyle: 'solid',
    // borderColor: '#DFE3E8',
    // '& th': { backgroundColor: 'transparent' },
  },
  tableHeader1: { border: 1, borderStyle: 'solid', borderColor: '#DFE3E8', '& th': { backgroundColor: 'transparent' } },
  tableHeader: {},
  tableHeader2: {
    borderTop: 1,
    borderLeft: 1,
    borderRight: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    '& th': { backgroundColor: 'transparent' },
  },
  tableBody: {},
  tableRow: {
    padding: '0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
  },
  tableRow2: {
    flexDirection: 'row',
    width: '380px',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
  },
  tableRow1: {
    flexDirection: 'row',
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '0%' },
  tableCell_Vers: { borderRight: 'solid 1px #DFE3E8', padding: '8px' },
  tableCell_0: {
    width: '392px',
    paddingRight: 16,
    borderRight: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    padding: '8px',
  },
  tableCell_0_1: {
    width: '392px',
    paddingRight: 16,
    borderRight: 1,
    borderLeft: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    padding: '8px',
  },
  tableCell_2: {
    width: '75%',
    paddingRight: 16,
    borderRight: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    padding: '8px',
  },
  tableCell_2_1: {
    width: '70%',
    paddingRight: 16,
    borderRight: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    padding: '8px',
  },
  tableCell_3: { width: '25%', padding: '8px', borderRight: 1, borderStyle: 'solid', borderColor: '#DFE3E8' },
  tableCell_3_3: { width: '170px', padding: '8px', borderRight: 1, borderStyle: 'solid', borderColor: '#DFE3E8' },
  tableCell_4_0: { width: '110px', padding: '8px', borderRight: 1, borderStyle: 'solid', borderColor: '#DFE3E8' },
  tableCell_4: { width: '110px', padding: '8px' },
  tableCell_4_1: { width: '30%', padding: '8px' },
  tableCell_4_2: { width: '25%', padding: '8px' },
});

export default styles;