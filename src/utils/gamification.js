export const POINTS = {
  REPORT: 10,
  CONFIRM: 5,
  VERIFIED_BONUS: 20,
  FIXED_UPDATE: 30,
}

export const BADGES = {
  FIRST_REPORT: {
    id: 'first-report',
    name: 'First Report',
    description: 'Reported your first pothole',
    emoji: '🚧',
    condition: (user, potholes) =>
      potholes.filter(p => p.reportedBy === user.id).length >= 1,
  },
  POTHOLE_HUNTER_5: {
    id: 'pothole-hunter-5',
    name: 'Pothole Hunter Lvl 5',
    description: 'Reported 5 potholes',
    emoji: '🔍',
    condition: (user, potholes) =>
      potholes.filter(p => p.reportedBy === user.id).length >= 5,
  },
  ROAD_GUARDIAN: {
    id: 'road-guardian',
    name: 'Road Guardian',
    description: 'Reported 10 potholes',
    emoji: '🛡️',
    condition: (user, potholes) =>
      potholes.filter(p => p.reportedBy === user.id).length >= 10,
  },
  CYCLIST_PROTECTOR: {
    id: 'cyclist-protector',
    name: 'Cyclist Protector',
    description: 'Reported a pothole on a cycle lane',
    emoji: '🚴',
    condition: (user, potholes) =>
      potholes.filter(p => p.reportedBy === user.id && p.roadType === 'cycle-lane').length >= 1,
  },
  TOP_CONFIRMER: {
    id: 'top-confirmer',
    name: 'Top Confirmer',
    description: 'Confirmed 5 potholes',
    emoji: '✅',
    condition: (user) => user.confirmationsCount >= 5,
  },
  FIXER: {
    id: 'fixer',
    name: 'The Fixer',
    description: 'Marked a pothole as fixed',
    emoji: '🔧',
    condition: (user) => user.fixedCount >= 1,
  },
}

export function checkNewBadges(user, potholes) {
  return Object.values(BADGES)
    .filter(b => !user.badges.includes(b.id) && b.condition(user, potholes))
    .map(b => b.id)
}
