import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '@/constants';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  whiteCard: {
    backgroundColor: '#ffffff',
  },
  content: {
    padding: DIMENSIONS.SPACING.LG,
  },
  header: {
    padding: DIMENSIONS.SPACING.XXL,
    marginBottom: DIMENSIONS.SPACING.LG,
    borderRadius: DIMENSIONS.RADIUS.LG,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: DIMENSIONS.SPACING.LG,
  },
  sectionTitle: {
    marginBottom: DIMENSIONS.SPACING.LG,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginTop: DIMENSIONS.SPACING.SM,
  },
  listItem: {
    paddingHorizontal: 0,
  },
  sectionDescription: {
    marginBottom: DIMENSIONS.SPACING.LG,
    opacity: 0.7,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONS.SPACING.SM,
  },
  permissionInfo: {
    flex: 1,
    marginRight: DIMENSIONS.SPACING.LG,
  },
  permissionDesc: {
    opacity: 0.7,
    marginTop: 2,
  },
  permissionButton: {
    borderColor: '#667eea',
  },
  divider: {
    marginVertical: DIMENSIONS.SPACING.LG,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: DIMENSIONS.SPACING.SM,
  },
  switchInfo: {
    flex: 1,
    marginRight: DIMENSIONS.SPACING.LG,
  },
  switchDesc: {
    opacity: 0.7,
    marginTop: 2,
  },
  timeText: {
    color: '#667eea',
    marginTop: DIMENSIONS.SPACING.XS,
    fontWeight: '600',
  },
  testButton: {
    marginTop: DIMENSIONS.SPACING.SM,
    borderColor: '#667eea',
  },
  soundSection: {
    marginVertical: DIMENSIONS.SPACING.SM,
  },
  soundTitle: {
    marginBottom: DIMENSIONS.SPACING.XS,
  },
  soundDesc: {
    opacity: 0.7,
    marginBottom: DIMENSIONS.SPACING.MD,
  },
  soundButtons: {
    marginTop: DIMENSIONS.SPACING.XS,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DIMENSIONS.SPACING.SM,
  },
  radioContent: {
    flex: 1,
  },
  radioItem: {
    paddingHorizontal: 0,
  },
  listDivider: {
    marginVertical: DIMENSIONS.SPACING.XS,
  },
  reminderSection: {
    marginVertical: DIMENSIONS.SPACING.SM,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONS.SPACING.SM,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderDesc: {
    opacity: 0.7,
    marginTop: 2,
  },
  timePickerContainer: {
    alignItems: 'flex-start',
    marginTop: DIMENSIONS.SPACING.SM,
  },
  timeButton: {
    borderColor: '#667eea',
  },
  testSection: {
    marginVertical: DIMENSIONS.SPACING.SM,
  },
  testTitle: {
    marginBottom: DIMENSIONS.SPACING.XS,
  },
  testDesc: {
    opacity: 0.7,
    marginBottom: DIMENSIONS.SPACING.SM,
  },
});