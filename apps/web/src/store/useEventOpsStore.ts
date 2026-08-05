import { create } from 'zustand';

export interface DepartmentInfo {
  id: string;
  name: string;
  icon: string;
  supervisor: string;
  totalWorkers: number;
  freeWorkers: number;
  busyWorkers: number;
  activeTasks: number;
  avgResponseSec: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface WorkerCard {
  id: string;
  name: string;
  department: string;
  icon: string;
  supervisor: string;
  status: 'FREE' | 'GOING_TO_TASK' | 'WORKING' | 'OFFLINE';
  battery: number;
  gpsAccuracy: string;
  speed: string;
  eta: string;
  currentTask: string;
  completedToday: number;
  distance: string;
  network: string;
  routeCoordinates: { x: number; y: number }[];
  breadcrumbs: { x: number; y: number }[];
  x: number;
  y: number;
}

export interface MultiDeptTask {
  id: string;
  title: string;
  department: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  stage: 'WAITING' | 'ASSIGNED' | 'TRAVELLING' | 'WORKING' | 'VERIFICATION' | 'COMPLETED';
  location: string;
  waitingSeconds: number;
  assignedWorkers: { id: string; name: string; dept: string; eta: string }[];
  rootCauseAnalysis?: string;
  candidates?: { id: string; name: string; dist: string; score: number; battery: number }[];
  timeline?: { time: string; event: string }[];
  x: number;
  y: number;
}

export interface GISLayerState {
  workers: boolean;
  vehicles: boolean;
  cameras: boolean;
  gates: boolean;
  barricades: boolean;
  crowdDensity: boolean;
  wifi: boolean;
  powerLines: boolean;
  generators: boolean;
  medical: boolean;
  security: boolean;
  parking: boolean;
  foodWater: boolean;
  toilets: boolean;
  roads: boolean;
  incidentZones: boolean;
  hazardZones: boolean;
  weather: boolean;
}

export interface CopilotMessage {
  id: string;
  sender: 'MANAGER' | 'AI';
  text: string;
  timestamp: string;
  structuredRecommendation?: {
    title: string;
    reason: string;
    recommendation: string;
    estimatedResolution: string;
    actionTarget: string;
    crowdIncrease: string;
  };
}

export interface VenueBlueprintPreset {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  polygonsCount: number;
}

interface EventOSMasterStore {
  eventName: string;
  crowdCount: number;
  criticalIncidentsCount: number;
  highIncidentsCount: number;
  mediumIncidentsCount: number;
  totalWorkersOnline: number;
  healthyDeptsCount: number;
  totalDeptsCount: number;
  equipmentAlertsCount: number;
  weatherText: string;

  departments: DepartmentInfo[];
  workers: WorkerCard[];
  tasks: MultiDeptTask[];
  incidents: MultiDeptTask[]; // Alias for backward compatibility
  gisLayers: GISLayerState;

  activeVenuePreset: VenueBlueprintPreset | null;
  actionRequiredIncidentId: string | null;
  dispatchModalIncidentId: string | null;
  selectedTimelineIncidentId: string | null;
  selectedDepartmentFilter: string;
  selectedWorkerCard: WorkerCard | null;
  selectedTaskModal: MultiDeptTask | null;
  selectedWorkerDetail: any | null;
  
  copilotMessages: CopilotMessage[];

  // Replay Controller State
  isReplaying: boolean;
  isPlayingPlayback: boolean;
  playbackMinute: number;

  // Actions
  setEventPreset: (preset: { name: string; crowd: number; workers: number; depts: number; venue: string }) => void;
  setSelectedDepartmentFilter: (dept: string) => void;
  setSelectedWorkerCard: (worker: WorkerCard | null) => void;
  setSelectedWorkerDetail: (worker: any | null) => void;
  setSelectedTaskModal: (task: MultiDeptTask | null) => void;
  setSelectedVenuePreset: (preset: VenueBlueprintPreset | null) => void;
  setActionRequiredIncidentId: (id: string | null) => void;
  setDispatchModalIncidentId: (id: string | null) => void;
  setSelectedTimelineIncidentId: (id: string | null) => void;
  toggleGISLayer: (layerKey: keyof GISLayerState) => void;
  setIsReplaying: (playing: boolean) => void;
  setIsPlayingPlayback: (playing: boolean) => void;
  setReplayMinute: (min: number) => void;
  
  advanceTaskStage: (taskId: string) => void;
  advanceIncidentStage: (taskId: string) => void;
  assignCandidateToIncident: (incidentId: string, candidateName: string) => void;
  assignWorkerToMultiDeptTask: (taskId: string, workerName: string, dept: string) => void;
  sendCopilotMessage: (text: string) => void;
  approveAiRecommendation: (title: string) => void;
}

const initialTasks: MultiDeptTask[] = [
  {
    id: 'task-101',
    title: 'Gate 4 Attendee Medical Collapse',
    department: 'Medical & Doctors',
    category: 'MEDICAL',
    priority: 'EMERGENCY',
    stage: 'TRAVELLING',
    location: 'VIP Gate 4 Turnstiles',
    waitingSeconds: 8,
    assignedWorkers: [{ id: 'w-102', name: 'Dr. Ravi Kumar', dept: 'Medical', eta: '38s' }],
    candidates: [
      { id: 'w-102', name: 'Dr. Ravi Kumar', dist: '15m away', score: 0.96, battery: 88 },
      { id: 'w-103', name: 'Ajay Singh', dist: '30m away', score: 0.81, battery: 76 }
    ],
    timeline: [
      { time: '12:01 PM', event: 'Reported via Voice Input at Gate 4' },
      { time: '12:02 PM', event: 'AI Classified: Emergency Medical Collapse' },
      { time: '12:03 PM', event: 'Dr. Ravi Kumar Auto-Dispatched' }
    ],
    x: 26,
    y: 38
  },
  {
    id: 'task-102',
    title: 'Main Stage A LED Screen & Spotlight Tripped',
    department: 'Lighting',
    category: 'LIGHTING',
    priority: 'HIGH',
    stage: 'WORKING',
    location: 'Stage A Grid Controls',
    waitingSeconds: 42,
    rootCauseAnalysis: 'Root Cause: Power Grid Voltage Spike. Recommended: Assign Electrician (Raj Kumar) + Audio Tech (Sunil Rao).',
    assignedWorkers: [
      { id: 'w-201', name: 'Raj Kumar', dept: 'Lighting', eta: '2m' }
    ],
    candidates: [
      { id: 'w-201', name: 'Raj Kumar', dist: '5m away', score: 0.98, battery: 83 }
    ],
    timeline: [
      { time: '12:00 PM', event: 'Grid Sensor Alert: 440V Voltage Trip' },
      { time: '12:02 PM', event: 'Raj Kumar (Electrician) Dispatched' }
    ],
    x: 68,
    y: 24
  }
];

export const useEventOpsStore = create<EventOSMasterStore>((set, get) => ({
  eventName: 'CM PUBLIC RALLY COMMAND CENTER',
  crowdCount: 52140,
  criticalIncidentsCount: 3,
  highIncidentsCount: 11,
  mediumIncidentsCount: 27,
  totalWorkersOnline: 298,
  healthyDeptsCount: 18,
  totalDeptsCount: 20,
  equipmentAlertsCount: 4,
  weatherText: 'Clear 28°C',

  selectedDepartmentFilter: 'ALL',
  selectedWorkerCard: null,
  selectedWorkerDetail: null,
  selectedTaskModal: null,
  activeVenuePreset: {
    id: 'v-1',
    name: '🏟️ Metropolitan Olympic Stadium',
    type: 'Stadium / Arena',
    coordinates: [78.4867, 17.3850],
    polygonsCount: 14
  },
  actionRequiredIncidentId: 'task-101',
  dispatchModalIncidentId: null,
  selectedTimelineIncidentId: 'task-101',

  isReplaying: false,
  isPlayingPlayback: false,
  playbackMinute: 12,

  gisLayers: {
    workers: true,
    vehicles: true,
    cameras: true,
    gates: true,
    barricades: true,
    crowdDensity: true,
    wifi: true,
    powerLines: true,
    generators: true,
    medical: true,
    security: true,
    parking: true,
    foodWater: true,
    toilets: true,
    roads: true,
    incidentZones: true,
    hazardZones: true,
    weather: true
  },

  copilotMessages: [
    {
      id: 'm-1',
      sender: 'AI',
      text: 'EventOS Decision Engine online. Monitoring all 20 operational departments. Crowd density in Zone B is normal.',
      timestamp: '12:00 PM'
    },
    {
      id: 'm-2',
      sender: 'MANAGER',
      text: 'Why is Gate B congested?',
      timestamp: '12:04 PM'
    },
    {
      id: 'm-3',
      sender: 'AI',
      text: 'Gate B attendee flow spiked +42% following VIP Convoy arrival.',
      timestamp: '12:04 PM',
      structuredRecommendation: {
        title: 'Gate B Surge Recommendation',
        reason: 'VIP Arrival caused turnstile queue buildup',
        recommendation: 'Deploy 2 Security Guards + 1 Volunteer',
        estimatedResolution: '4 mins',
        actionTarget: 'Vikram Security',
        crowdIncrease: '+42% Ingress Surge'
      }
    }
  ],

  departments: [
    { id: 'd-1', name: 'Lighting', icon: '⚡', supervisor: 'Ramesh', totalWorkers: 24, freeWorkers: 18, busyWorkers: 6, activeTasks: 2, avgResponseSec: 38, status: 'HEALTHY' },
    { id: 'd-2', name: 'Audio', icon: '🎤', supervisor: 'Sunil Rao', totalWorkers: 15, freeWorkers: 11, busyWorkers: 4, activeTasks: 1, avgResponseSec: 32, status: 'HEALTHY' },
    { id: 'd-3', name: 'LED Wall', icon: '🖥️', supervisor: 'Karan Tech', totalWorkers: 10, freeWorkers: 7, busyWorkers: 3, activeTasks: 1, avgResponseSec: 45, status: 'HEALTHY' },
    { id: 'd-4', name: 'Stage Setup', icon: '🎪', supervisor: 'Manish Rig', totalWorkers: 16, freeWorkers: 12, busyWorkers: 4, activeTasks: 2, avgResponseSec: 40, status: 'HEALTHY' },
    { id: 'd-5', name: 'Camera & Broadcast', icon: '📹', supervisor: 'Deepak Lens', totalWorkers: 14, freeWorkers: 10, busyWorkers: 4, activeTasks: 1, avgResponseSec: 35, status: 'HEALTHY' },
    { id: 'd-6', name: 'Internet & WiFi', icon: '📡', supervisor: 'Amit Net', totalWorkers: 8, freeWorkers: 6, busyWorkers: 2, activeTasks: 0, avgResponseSec: 25, status: 'HEALTHY' },
    { id: 'd-7', name: 'Power & Grid', icon: '🔌', supervisor: 'Suresh Power', totalWorkers: 12, freeWorkers: 8, busyWorkers: 4, activeTasks: 3, avgResponseSec: 30, status: 'WARNING' },
    { id: 'd-8', name: 'Generators', icon: '⚙️', supervisor: 'Prakash Diesel', totalWorkers: 8, freeWorkers: 7, busyWorkers: 1, activeTasks: 1, avgResponseSec: 28, status: 'HEALTHY' },
    { id: 'd-9', name: 'Security & Patrol', icon: '🛡️', supervisor: 'Vikram Singh', totalWorkers: 62, freeWorkers: 51, busyWorkers: 11, activeTasks: 5, avgResponseSec: 42, status: 'HEALTHY' },
    { id: 'd-10', name: 'Medical & Doctors', icon: '🚑', supervisor: 'Dr. Priya Sharma', totalWorkers: 14, freeWorkers: 12, busyWorkers: 2, activeTasks: 1, avgResponseSec: 28, status: 'HEALTHY' },
    { id: 'd-11', name: 'Parking & Traffic', icon: '🚗', supervisor: 'Anil Gate', totalWorkers: 31, freeWorkers: 24, busyWorkers: 7, activeTasks: 3, avgResponseSec: 48, status: 'HEALTHY' },
    { id: 'd-12', name: 'Housekeeping & Clean', icon: '🧹', supervisor: 'Rajesh Sweeper', totalWorkers: 18, freeWorkers: 13, busyWorkers: 5, activeTasks: 2, avgResponseSec: 50, status: 'HEALTHY' },
    { id: 'd-13', name: 'Volunteers', icon: '🙋', supervisor: 'Neha Guide', totalWorkers: 45, freeWorkers: 38, busyWorkers: 7, activeTasks: 2, avgResponseSec: 33, status: 'HEALTHY' },
    { id: 'd-14', name: 'Ticket & Gate Check', icon: '🎫', supervisor: 'Vijay Turnstile', totalWorkers: 22, freeWorkers: 17, busyWorkers: 5, activeTasks: 1, avgResponseSec: 36, status: 'HEALTHY' },
    { id: 'd-15', name: 'VIP Escort', icon: '⭐', supervisor: 'Karan Bouncer', totalWorkers: 12, freeWorkers: 10, busyWorkers: 2, activeTasks: 1, avgResponseSec: 22, status: 'HEALTHY' },
    { id: 'd-16', name: 'Food Stalls', icon: '🍔', supervisor: 'Chef Sanjay', totalWorkers: 14, freeWorkers: 11, busyWorkers: 3, activeTasks: 1, avgResponseSec: 44, status: 'HEALTHY' },
    { id: 'd-17', name: 'Water Supply', icon: '🚰', supervisor: 'Ravi Tanker', totalWorkers: 10, freeWorkers: 8, busyWorkers: 2, activeTasks: 1, avgResponseSec: 39, status: 'HEALTHY' },
    { id: 'd-18', name: 'Logistics & Crane', icon: '📦', supervisor: 'Mahesh Loader', totalWorkers: 9, freeWorkers: 6, busyWorkers: 3, activeTasks: 2, avgResponseSec: 52, status: 'HEALTHY' },
    { id: 'd-19', name: 'Decorations & Stage', icon: '🎨', supervisor: 'Pooja Floral', totalWorkers: 8, freeWorkers: 7, busyWorkers: 1, activeTasks: 0, avgResponseSec: 41, status: 'HEALTHY' },
    { id: 'd-20', name: 'Transport & Shuttles', icon: '🚌', supervisor: 'Ganesh Bus', totalWorkers: 11, freeWorkers: 9, busyWorkers: 2, activeTasks: 1, avgResponseSec: 37, status: 'HEALTHY' }
  ],

  workers: [
    {
      id: 'w-201',
      name: 'Raj Kumar',
      department: 'Lighting',
      icon: '⚡',
      supervisor: 'Ramesh',
      status: 'GOING_TO_TASK',
      battery: 83,
      gpsAccuracy: '3m (Excellent)',
      speed: '4 km/h',
      eta: '2 mins',
      currentTask: 'Replace Stage A Spotlight #203',
      completedToday: 18,
      distance: '84m',
      network: '5G (Excellent)',
      x: 62,
      y: 28,
      breadcrumbs: [{ x: 55, y: 38 }, { x: 58, y: 32 }, { x: 62, y: 28 }],
      routeCoordinates: [{ x: 62, y: 28 }, { x: 68, y: 24 }]
    },
    {
      id: 'w-102',
      name: 'Dr. Ravi Kumar',
      department: 'Medical & Doctors',
      icon: '🚑',
      supervisor: 'Dr. Priya Sharma',
      status: 'GOING_TO_TASK',
      battery: 88,
      gpsAccuracy: '2m (Excellent)',
      speed: '6 km/h',
      eta: '38s',
      currentTask: 'Gate 4 Attendee Medical Emergency',
      completedToday: 12,
      distance: '42m',
      network: '5G (Excellent)',
      x: 24,
      y: 35,
      breadcrumbs: [{ x: 18, y: 28 }, { x: 21, y: 31 }, { x: 24, y: 35 }],
      routeCoordinates: [{ x: 24, y: 35 }, { x: 26, y: 38 }]
    }
  ],

  tasks: initialTasks,
  incidents: initialTasks,

  setEventPreset: (preset) => set({
    eventName: `${preset.name} COMMAND CENTER`,
    crowdCount: preset.crowd,
    totalWorkersOnline: preset.workers,
    healthyDeptsCount: preset.depts
  }),

  setSelectedDepartmentFilter: (dept) => set({ selectedDepartmentFilter: dept }),
  setSelectedWorkerCard: (worker) => set({ selectedWorkerCard: worker }),
  setSelectedWorkerDetail: (worker) => set({ selectedWorkerDetail: worker }),
  setSelectedTaskModal: (task) => set({ selectedTaskModal: task }),
  setSelectedVenuePreset: (preset) => set({ activeVenuePreset: preset }),
  setActionRequiredIncidentId: (id) => set({ actionRequiredIncidentId: id }),
  setDispatchModalIncidentId: (id) => set({ dispatchModalIncidentId: id }),
  setSelectedTimelineIncidentId: (id) => set({ selectedTimelineIncidentId: id }),

  toggleGISLayer: (layerKey) => set((state) => ({
    gisLayers: { ...state.gisLayers, [layerKey]: !state.gisLayers[layerKey] }
  })),

  setIsReplaying: (playing) => set({ isReplaying: playing }),
  setIsPlayingPlayback: (playing) => set({ isPlayingPlayback: playing }),
  setReplayMinute: (min) => set({ playbackMinute: min }),

  advanceTaskStage: (taskId) => set((state) => {
    const nextMap: Record<string, MultiDeptTask['stage']> = {
      WAITING: 'ASSIGNED',
      ASSIGNED: 'TRAVELLING',
      TRAVELLING: 'WORKING',
      WORKING: 'VERIFICATION',
      VERIFICATION: 'COMPLETED',
      COMPLETED: 'COMPLETED'
    };
    const updated = state.tasks.map(t => t.id === taskId ? { ...t, stage: nextMap[t.stage] } : t);
    return { tasks: updated, incidents: updated };
  }),

  advanceIncidentStage: (taskId) => get().advanceTaskStage(taskId),

  assignCandidateToIncident: (incidentId, candidateName) => set((state) => {
    const updated = state.tasks.map(t => t.id === incidentId ? {
      ...t,
      stage: 'ASSIGNED' as const,
      assignedWorkers: [{ id: `w-${Date.now()}`, name: candidateName, dept: t.department, eta: '1m' }]
    } : t);
    return { tasks: updated, incidents: updated, actionRequiredIncidentId: null };
  }),

  assignWorkerToMultiDeptTask: (taskId, workerName, dept) => set((state) => {
    const updated = state.tasks.map(t => t.id === taskId ? {
      ...t,
      stage: 'ASSIGNED' as const,
      assignedWorkers: [...t.assignedWorkers, { id: `w-${Date.now()}`, name: workerName, dept, eta: '2 mins' }]
    } : t);
    return { tasks: updated, incidents: updated };
  }),

  sendCopilotMessage: (text) => set((state) => ({
    copilotMessages: [
      ...state.copilotMessages,
      { id: `m-${Date.now()}`, sender: 'MANAGER', text, timestamp: '12:05 PM' },
      { id: `m-${Date.now() + 1}`, sender: 'AI', text: `Analyzing multi-department telemetry for query: "${text}". Recommending optimal worker allocation across all 20 teams.`, timestamp: '12:05 PM' }
    ]
  })),

  approveAiRecommendation: (title) => set((state) => ({
    copilotMessages: [
      ...state.copilotMessages,
      { id: `m-${Date.now()}`, sender: 'AI', text: `✅ Recommendation Approved: "${title}". Dispatch instructions issued to ground supervisors.`, timestamp: '12:06 PM' }
    ]
  }))
}));
