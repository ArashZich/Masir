import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '@/constants';

export const analyticsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  whiteCard: {
    backgroundColor: "#ffffff",
  },
  content: {
    padding: DIMENSIONS.SPACING.LG,
    paddingBottom: 100,
  },
  headerCard: {
    margin: DIMENSIONS.SPACING.LG,
    marginTop: 0,
    overflow: "hidden",
  },
  headerGradient: {
    padding: DIMENSIONS.SPACING.XXXL,
    alignItems: "center",
  },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: DIMENSIONS.SPACING.LG,
  },
  headerTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: DIMENSIONS.SPACING.SM,
  },
  headerSubtitle: {
    color: "#ffffff",
    opacity: 0.9,
    textAlign: "center",
  },
  statsCard: {
    margin: DIMENSIONS.SPACING.LG,
    marginTop: 0,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: DIMENSIONS.SPACING.XL,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: DIMENSIONS.SPACING.XXL,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    marginBottom: DIMENSIONS.SPACING.MD,
  },
  statNumber: {
    fontWeight: "bold",
    marginBottom: DIMENSIONS.SPACING.XS,
  },
  statLabel: {
    textAlign: "center",
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: DIMENSIONS.SPACING.SM,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: DIMENSIONS.SPACING.MD,
  },
  progressLabel: {
    fontWeight: "600",
  },
  progressChip: {
    backgroundColor: "rgba(82, 196, 26, 0.1)",
  },
  progressBar: {
    height: DIMENSIONS.PROGRESS.HEIGHT_MD,
    borderRadius: DIMENSIONS.RADIUS.SM,
  },
  calendarCard: {
    margin: DIMENSIONS.SPACING.LG,
    marginTop: 0,
  },
  cardTitle: {
    marginBottom: DIMENSIONS.SPACING.SM,
    fontWeight: "600",
  },
  cardDescription: {
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: DIMENSIONS.SPACING.LG,
  },
  calendar: {
    borderRadius: DIMENSIONS.RADIUS.LG,
    paddingVertical: DIMENSIONS.SPACING.MD,
    paddingHorizontal: DIMENSIONS.SPACING.SM,
  },
  calendarLegend: {
    marginTop: DIMENSIONS.SPACING.LG,
    paddingTop: DIMENSIONS.SPACING.LG,
    borderTopWidth: 1,
  },
  legendTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: DIMENSIONS.SPACING.MD,
  },
  legendItems: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    opacity: 0.7,
  },
  listItem: {
    paddingVertical: DIMENSIONS.SPACING.SM,
  },
  insightsCard: {
    margin: DIMENSIONS.SPACING.LG,
    marginTop: 0,
  },
  insightsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: DIMENSIONS.SPACING.LG,
  },
  insightItem: {
    alignItems: "center",
    flex: 1,
  },
  insightIcon: {
    marginBottom: DIMENSIONS.SPACING.SM,
  },
  insightValue: {
    fontWeight: "bold",
    marginBottom: DIMENSIONS.SPACING.XS,
  },
  insightLabel: {
    textAlign: "center",
    opacity: 0.7,
  },
  dayInsight: {
    backgroundColor: "rgba(103, 126, 234, 0.1)",
    padding: DIMENSIONS.SPACING.MD,
    borderRadius: DIMENSIONS.RADIUS.MD,
    marginVertical: DIMENSIONS.SPACING.SM,
  },
  dayInsightTitle: {
    fontWeight: "600",
    marginBottom: DIMENSIONS.SPACING.XS,
  },
  dayInsightValue: {
    opacity: 0.7,
  },
  insightDivider: {
    marginVertical: DIMENSIONS.SPACING.LG,
  },
  smartInsights: {
    paddingTop: DIMENSIONS.SPACING.SM,
  },
  smartTitle: {
    fontWeight: "600",
    marginBottom: DIMENSIONS.SPACING.MD,
  },
  smartMessage: {
    padding: DIMENSIONS.SPACING.SM,
    borderRadius: DIMENSIONS.RADIUS.SM,
    marginBottom: DIMENSIONS.SPACING.SM,
    lineHeight: 16,
  },
  streaksCard: {
    margin: DIMENSIONS.SPACING.LG,
    marginTop: 0,
  },
  streaksContainer: {
    marginTop: DIMENSIONS.SPACING.SM,
  },
  streakItem: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: DIMENSIONS.SPACING.LG,
    borderRadius: DIMENSIONS.RADIUS.LG,
    marginBottom: DIMENSIONS.SPACING.MD,
    borderWidth: 1,
    borderColor: "rgba(103, 126, 234, 0.1)",
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: DIMENSIONS.SPACING.MD,
  },
  streakHabitName: {
    fontWeight: "600",
    flex: 1,
  },
  streakChip: {
    backgroundColor: "rgba(255, 87, 34, 0.1)",
  },
  streakChipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF5722",
  },
  streakStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: DIMENSIONS.SPACING.SM,
  },
  streakStat: {
    alignItems: "center",
  },
  streakStatLabel: {
    opacity: 0.6,
    marginBottom: 2,
  },
  streakStatValue: {
    fontWeight: "600",
  },
  streakProgress: {
    height: DIMENSIONS.PROGRESS.HEIGHT_SM,
    borderRadius: 3,
  },
  emptyStreaks: {
    alignItems: "center",
    paddingVertical: DIMENSIONS.SPACING.XXXL,
  },
  emptyIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: DIMENSIONS.SPACING.LG,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: "center",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: DIMENSIONS.SPACING.XL,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: DIMENSIONS.RADIUS.XXL,
    width: "95%",
    height: "85%",
    maxWidth: DIMENSIONS.MODAL.MAX_WIDTH,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: "#667eea",
    paddingVertical: DIMENSIONS.SPACING.XXL,
    paddingHorizontal: DIMENSIONS.SPACING.XXL,
    alignItems: "center",
  },
  modalTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.SPACING.XXL,
    paddingTop: DIMENSIONS.SPACING.XXL,
    paddingBottom: DIMENSIONS.SPACING.LG,
  },
  modalMood: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: DIMENSIONS.SPACING.XL,
    borderRadius: DIMENSIONS.RADIUS.XL,
    marginBottom: DIMENSIONS.SPACING.XL,
  },
  moodIcon: {
    width: DIMENSIONS.ICON.XL,
    height: DIMENSIONS.ICON.XL,
    borderRadius: DIMENSIONS.RADIUS.XL,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: DIMENSIONS.SPACING.MD,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: DIMENSIONS.SPACING.XL,
  },
  moodText: {
    fontWeight: "600",
    color: "#2d3748",
  },
  modalNote: {
    backgroundColor: "#fff5f5",
    padding: DIMENSIONS.SPACING.XL,
    borderRadius: DIMENSIONS.RADIUS.XL,
    marginBottom: DIMENSIONS.SPACING.XL,
    borderRightWidth: 4,
    borderRightColor: "#667eea",
  },
  modalNoteText: {
    fontStyle: "italic",
    color: "#4a5568",
    lineHeight: 22,
  },
  modalProgress: {
    backgroundColor: "#f0f9ff",
    padding: DIMENSIONS.SPACING.XL,
    borderRadius: DIMENSIONS.RADIUS.XL,
    marginBottom: DIMENSIONS.SPACING.XXL,
  },
  progressTitle: {
    fontWeight: "600",
    color: "#2d3748",
    fontSize: 16,
  },
  progressText: {
    color: "#667eea",
    fontWeight: "600",
    fontSize: 15,
  },
  modalProgressBar: {
    height: DIMENSIONS.PROGRESS.HEIGHT_LG,
    borderRadius: DIMENSIONS.RADIUS.SM,
    backgroundColor: "#e2e8f0",
  },
  habitsSection: {
    marginBottom: DIMENSIONS.SPACING.LG,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: DIMENSIONS.SPACING.LG,
    borderRadius: DIMENSIONS.RADIUS.LG,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  habitIcon: {
    width: DIMENSIONS.ICON.LG,
    height: DIMENSIONS.ICON.LG,
    borderRadius: DIMENSIONS.RADIUS.LG,
    justifyContent: "center",
    alignItems: "center",
    marginRight: DIMENSIONS.SPACING.MD,
  },
  completedIcon: {
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "#10b981",
    width: DIMENSIONS.ICON.LG,
    height: DIMENSIONS.ICON.LG,
    borderRadius: DIMENSIONS.RADIUS.LG,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "bold",
  },
  incompleteIcon: {
    width: DIMENSIONS.ICON.LG,
    height: DIMENSIONS.ICON.LG,
    borderRadius: DIMENSIONS.RADIUS.LG,
    borderWidth: 2,
    borderColor: "#cbd5e0",
    backgroundColor: "#f7fafc",
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: DIMENSIONS.SPACING.XS,
    fontSize: 15,
  },
  completedHabit: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  habitCategory: {
    color: "#718096",
    fontSize: 13,
  },
  emptyHabits: {
    alignItems: "center",
    paddingVertical: DIMENSIONS.SPACING.XXXL,
  },
  emptyHabitsText: {
    fontStyle: "italic",
  },
  modalFooter: {
    paddingHorizontal: DIMENSIONS.SPACING.XXL,
    paddingVertical: DIMENSIONS.SPACING.XL,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  closeButton: {
    backgroundColor: "#667eea",
    borderRadius: DIMENSIONS.RADIUS.LG,
    paddingVertical: DIMENSIONS.SPACING.SM,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});