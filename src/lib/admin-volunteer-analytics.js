const CURRENT_YEAR = new Date().getFullYear();

const MONTHLY_REGISTRATIONS = [4, 5, 6, 7, 8, 6, 5, 7, 8, 9, 10, 9];

export function getStaticVolunteerAnalytics() {
  return {
    totalVolunteers: 84,
    activeVolunteers: 61,
    fieldTeams: 9,
    availableToday: 27,
    pendingOnboarding: 8,
    retentionRate: 79,
    monthlyRegistrations: MONTHLY_REGISTRATIONS.map((total, index) => ({
      monthIndex: index,
      total,
      year: CURRENT_YEAR,
    })),
    recentActivities: [
      {
        id: "volunteer-activity-1",
        type: "Volunteer",
        title: "Field visit assigned",
        name: "Northern response team",
        status: "Assigned",
        date: new Date(CURRENT_YEAR, 5, 6, 9, 30, 0).toISOString(),
        description: "Three volunteers scheduled for beneficiary verification in Rangpur.",
      },
      {
        id: "volunteer-activity-2",
        type: "Volunteer",
        title: "Onboarding completed",
        name: "Community outreach batch",
        status: "Ready",
        date: new Date(CURRENT_YEAR, 5, 4, 15, 0, 0).toISOString(),
        description: "Five new volunteers completed orientation and safeguarding review.",
      },
      {
        id: "volunteer-activity-3",
        type: "Volunteer",
        title: "Support desk shift opened",
        name: "Volunteer coordination desk",
        status: "Open",
        date: new Date(CURRENT_YEAR, 5, 2, 11, 15, 0).toISOString(),
        description: "Two additional volunteers are needed for donor follow-up calls.",
      },
    ],
  };
}
